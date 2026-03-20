import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../services/user.service';
import { TeamStoreService } from '../../services/team-store.service';

interface TeamUser {
  uuid: string;
  name: string;
  email: string;
  roles: string[];
  teamName: string;
  startDate?: string;
}

@Component({
  selector: 'app-team-summary',
  templateUrl: './team-summary.component.html',
  styleUrls: ['./team-summary.component.css']
})
export class TeamSummaryComponent implements OnInit {
  users: TeamUser[] = [];
  selectedUser: TeamUser | null = null;
  displayedColumns: string[] = ['name', 'team', 'roles', 'startDate', 'actions'];
  isLoading = false;

  constructor(private userApi: UserApiService, private teamStore: TeamStoreService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.isLoading = true;
    try {
      const users = (await this.userApi.getUsers()) as any[];
      this.users = users.map((user) => this.normalizeUser(user));
    } finally {
      this.isLoading = false;
    }
  }

  selectUser(user: TeamUser): void {
    this.selectedUser = user;
  }

  trackByUuid(index: number, user: TeamUser): string {
    return user.uuid;
  }

  private normalizeUser(user: any): TeamUser {
    return {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      roles: Array.isArray(user.roles) ? user.roles : [],
      teamName: this.teamStore.getTeamName(user.uuid),
      startDate: user.startDate
    };
  }
}
