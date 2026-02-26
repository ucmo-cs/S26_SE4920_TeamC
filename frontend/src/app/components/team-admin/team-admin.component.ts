import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserApiService } from '../../services/user.service';
import { TeamStoreService } from '../../services/team-store.service';

interface TeamAdminUser {
  uuid: string;
  name: string;
  email: string;
  roles: string[];
  teamName: string;
  startDate?: string;
}

@Component({
  selector: 'app-team-admin',
  templateUrl: './team-admin.component.html',
  styleUrls: ['./team-admin.component.css']
})
export class TeamAdminComponent implements OnInit {
  users: TeamAdminUser[] = [];
  selectedUser: TeamAdminUser | null = null;
  displayedColumns: string[] = ['name', 'email', 'team', 'roles', 'actions'];
  teamForm: FormGroup;
  isLoading = false;

  constructor(
    private userApi: UserApiService,
    private teamStore: TeamStoreService,
    private fb: FormBuilder
  ) {
    this.teamForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      roles: [{ value: '', disabled: true }],
      startDate: [{ value: '', disabled: true }],
      teamName: ['']
    });
  }

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

  selectUser(user: TeamAdminUser): void {
    this.selectedUser = user;
    this.teamForm.reset();
    this.teamForm.patchValue({
      name: user.name,
      email: user.email,
      roles: user.roles.length ? user.roles.join(', ') : '—',
      startDate: user.startDate ?? '—',
      teamName: user.teamName
    });
  }

  saveTeam(): void {
    if (!this.selectedUser) {
      return;
    }

    const teamName = this.teamForm.get('teamName')?.value ?? '';
    this.teamStore.setTeamName(this.selectedUser.uuid, teamName);

    const updated = { ...this.selectedUser, teamName: teamName.trim() };
    this.selectedUser = updated;
    this.users = this.users.map((user) =>
      user.uuid === updated.uuid ? updated : user
    );
  }

  trackByUuid(index: number, user: TeamAdminUser): string {
    return user.uuid;
  }

  private normalizeUser(user: any): TeamAdminUser {
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
