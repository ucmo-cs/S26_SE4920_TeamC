import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../../services/user.service';
import { ROLE } from '../../../shared/constants/enum';

interface AdminUser {
  uuid: string;
  name: string;
  email: string;
  roles: string[];
}

@Component({
  selector: 'app-update-themes',
  templateUrl: './update-themes.component.html',
  styleUrls: ['./update-themes.component.css'],
})
export class UpdateThemesComponent implements OnInit {
  users: AdminUser[] = [];
  displayedColumns: string[] = ['name', 'email', 'roles', 'actions'];
  availableRoles = Object.values(ROLE);
  themeOptions = [
    { value: 'default', label: 'Default' },
    { value: 'forest', label: 'Forest Service' },
    { value: 'fema', label: 'FEMA' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'volcano', label: 'Volcano' },
  ];

  selectedTheme = 'default';

  constructor(private userApi: UserApiService) {}

  ngOnInit(): void {
    this.loadThemeSettings();
    this.loadUsers();
  }

  applyTheme(): void {
    const root = document.documentElement;
    root.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls);
      }
    });

    root.classList.add(`theme-${this.selectedTheme}`);
    localStorage.setItem('app-theme', this.selectedTheme);
  }

  private loadThemeSettings(): void {
    this.selectedTheme = localStorage.getItem('app-theme') || 'default';
    this.applyTheme();
  }

  async loadUsers(): Promise<void> {
    const users = (await this.userApi.getUsers()) as any[];
    this.users = users.map((user) => ({
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      roles: Array.isArray(user.roles) ? user.roles : [],
    }));
  }

  async saveUser(user: AdminUser): Promise<void> {
    try {
      const updated = await this.userApi.updateUserRoles(user.uuid, user.roles) as any;
      user.roles = Array.isArray(updated.roles) ? updated.roles : user.roles;
    } catch (error) {
      console.error('Failed to save roles:', error);
    }
  }

  trackByUuid(index: number, user: AdminUser): string {
    return user.uuid;
  }
}
