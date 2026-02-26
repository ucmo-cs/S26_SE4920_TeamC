import { Routes, RouterModule } from '@angular/router';
import { RolesListComponent } from './admin/roles/roles-list/roles-list.component';
import { RoleFormComponent } from './admin/roles/role-form/role-form.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DailyStatusComponent } from './components/daily-status/daily-status.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsOverviewComponent } from './components/projects-overview/projects-overview.component';
import { TeamSummaryComponent } from './components/team-summary/team-summary.component';
import { TeamAdminComponent } from './components/team-admin/team-admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }, 
  {
    path: 'daily-status',
    component: DailyStatusComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  { path: '', redirectTo: 'admin/roles', pathMatch: 'full' },
  {
    path: 'admin/projects',
    component: ProjectsComponent
  },
  {
    path: 'admin/teams',
    component: TeamAdminComponent
  },
  {
    path: 'projects',
    component: ProjectsOverviewComponent
  },
  {
    path: 'team-summary',
    component: TeamSummaryComponent
  },
  ];

  { path: 'admin', redirectTo: 'admin/roles', pathMatch: 'full' },
  { path: 'admin/roles', component: RolesListComponent },
  { path: 'admin/roles/new', component: RoleFormComponent },
  { path: 'admin/roles/:id', component: RoleFormComponent },

  { path: '**', redirectTo: 'admin/roles' }
];