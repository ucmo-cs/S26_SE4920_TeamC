import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface LeaderboardEntry {
  employeeName: string;
  score: number;
  updatedAt: string;
}

@Component({
  selector: 'app-game-landing',
  templateUrl: './game-landing.component.html',
  styleUrls: ['./game-landing.component.css']
})
export class GameLandingComponent implements OnInit, OnDestroy {
  private readonly gameOrigin = 'http://localhost:8080';
  private readonly gameScoreEventType = 'ROC_GAME_SCORE';
  private readonly leaderboardApiUrl = `${environment.apiBaseUrl}/leaderboard`;

  private messageListener: (event: MessageEvent) => void;

  employeeName = '';
  employeeIdentity = '';
  entries: LeaderboardEntry[] = [];
  autoSavedMessage = '';

  constructor(private authService: AuthService) {
    this.messageListener = (event: MessageEvent) => {
      void this.handleGameMessage(event);
    };
  }

  ngOnInit(): void {
    void this.loadEntries();
    void this.loadLoggedInEmployee();
    window.addEventListener('message', this.messageListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.messageListener);
  }

  openGame(): void {
    const parentOrigin = encodeURIComponent(window.location.origin);
    window.open(`${this.gameOrigin}/?parentOrigin=${parentOrigin}`, '_blank');
  }

  formatUpdatedAt(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  private async loadEntries(): Promise<void> {
    try {
      const response = await fetch(this.leaderboardApiUrl);
      if (!response.ok) {
        this.entries = [];
        return;
      }

      const parsed = (await response.json()) as LeaderboardEntry[];
      this.entries = (Array.isArray(parsed) ? parsed : [])
        .filter((entry) =>
          typeof entry?.employeeName === 'string' &&
          typeof entry?.score === 'number' &&
          typeof entry?.updatedAt === 'string'
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 25);
    } catch {
      this.entries = [];
    }
  }

  private async loadLoggedInEmployee(): Promise<void> {
    try {
      const user = await this.authService.getUser();
      const nameFromUser = String(user?.name ?? '').trim();
      const emailFromUser = String(user?.email ?? '').trim();

      if (nameFromUser) {
        this.employeeName = nameFromUser;
      } else if (emailFromUser) {
        this.employeeName = emailFromUser;
      } else {
        this.employeeName = 'Unknown Employee';
      }

      this.employeeIdentity = this.employeeName;
    } catch {
      this.employeeName = 'Unknown Employee';
      this.employeeIdentity = this.employeeName;
    }
  }

  private async handleGameMessage(event: MessageEvent): Promise<void> {
    if (event.origin !== this.gameOrigin) {
      return;
    }

    const payload = event.data as { type?: string; score?: number };
    if (payload?.type !== this.gameScoreEventType) {
      return;
    }

    const incomingScore = Number(payload.score);
    const name = await this.resolveEmployeeIdentity();
    if (!name || !Number.isFinite(incomingScore) || incomingScore < 0) {
      return;
    }

    const saved = await this.upsertEmployeeHighScore(name, Math.floor(incomingScore));
    if (saved) {
      this.autoSavedMessage = `Auto-saved score ${Math.floor(incomingScore)} for ${name}.`;
      return;
    }

    this.autoSavedMessage = 'Score captured, but leaderboard sync failed. Check backend API.';
  }

  private async upsertEmployeeHighScore(employeeName: string, submittedScore: number): Promise<boolean> {
    try {
      const response = await fetch(this.leaderboardApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeName,
          score: submittedScore
        })
      });

      if (!response.ok) {
        return false;
      }

      const payload = (await response.json()) as { entries?: LeaderboardEntry[] };
      this.entries = (Array.isArray(payload?.entries) ? payload.entries : [])
        .filter((entry) =>
          typeof entry?.employeeName === 'string' &&
          typeof entry?.score === 'number' &&
          typeof entry?.updatedAt === 'string'
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 25);

      return true;
    } catch {
      // Keep current entries if save fails.
      return false;
    }
  }

  private async resolveEmployeeIdentity(): Promise<string> {
    const existing = (this.employeeIdentity || this.employeeName || '').trim();
    if (existing) {
      return existing;
    }

    await this.loadLoggedInEmployee();
    const resolved = (this.employeeIdentity || this.employeeName || '').trim();
    return resolved || 'Unknown Employee';
    }
}
