import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamStoreService {
  private storageKey = 'roc-team-map';

  getTeamMap(): Record<string, string> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  }

  getTeamName(uuid: string): string {
    const map = this.getTeamMap();
    return map[uuid] ?? '';
  }

  setTeamName(uuid: string, teamName: string): void {
    const map = this.getTeamMap();
    const cleaned = teamName.trim();

    if (cleaned) {
      map[uuid] = cleaned;
    } else {
      delete map[uuid];
    }

    localStorage.setItem(this.storageKey, JSON.stringify(map));
  }
}
