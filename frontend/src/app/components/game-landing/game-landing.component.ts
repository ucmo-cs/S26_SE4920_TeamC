import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
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
export class GameLandingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gameContainer') gameContainer!: ElementRef<HTMLDivElement>;

  private readonly leaderboardApiUrl = `${environment.apiBaseUrl}/leaderboard`;

  employeeName = '';
  employeeIdentity = '';
  entries: LeaderboardEntry[] = [];
  autoSavedMessage = '';

  constructor(
    private authService: AuthService,
    private gameService: GameService
  ) {}


  ngOnInit(): void {
    void this.loadEntries();
    void this.loadLoggedInEmployee();
  }

  ngAfterViewInit(): void {
    const containerId = 'phaser-game-container';
    this.gameContainer.nativeElement.id = containerId;
    this.gameService.initializeGame(containerId, (score: number) => this.handleGameScore(score));
  }

  ngOnDestroy(): void {
    this.gameService.destroyGame();
  }

  private handleGameScore(score: number): void {
    const name = this.employeeIdentity || this.employeeName || 'Unknown Employee';
    if (!name || !Number.isFinite(score) || score < 0) {
      return;
    }

    void this.upsertEmployeeHighScore(name, Math.floor(score));
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
        this.autoSavedMessage = 'Score captured, but leaderboard sync failed. Check backend API.';
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

      this.autoSavedMessage = `Auto-saved score ${Math.floor(submittedScore)} for ${employeeName}.`;
      return true;
    } catch {
      this.autoSavedMessage = 'Score captured, but leaderboard sync failed. Check backend API.';
      return false;
    }
  }
}
