import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesListComponent } from '../roles/roles-list/roles-list.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RolesListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {}