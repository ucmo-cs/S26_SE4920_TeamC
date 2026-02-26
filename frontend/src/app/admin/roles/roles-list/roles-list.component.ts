import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RolesService } from '../roles.service';
import { Role } from '../models';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './roles-list.component.html',
})
export class RolesListComponent implements OnInit {
  roles: Role[] = [];
  loading = false;
  error = '';

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load roles';
        this.loading = false;
      }
    });
  }

  deleteRole(id: string) {
    if (!confirm('Delete this role?')) return;

    this.rolesService.deleteRole(id).subscribe({
      next: () => this.roles = this.roles.filter(r => r.id !== id),
      error: () => alert('Delete failed')
    });
  }
}