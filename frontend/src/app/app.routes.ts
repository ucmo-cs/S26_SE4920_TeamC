import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { DailyStatusComponent } from './components/daily-status/daily-status.component';
import { AdminComponent } from './components/admin/theme-mangment/admin.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsOverviewComponent } from './components/projects-overview/projects-overview.component';
import { TeamSummaryComponent } from './components/team-summary/team-summary.component';
import { TeamAdminComponent } from './components/team-admin/team-admin.component';
import { RolesListComponent } from './components/admin/roles/role-list/roles-list.component';
import { RoleFormComponent } from './components/admin/roles/role-form/role-form.component'
import { TimeOffComponent } from './components/time-off/time-off.component';

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
  { path: '', redirectTo: 'admin/roles', pathMatch: 'full' },
  { path: 'admin/roles', component: RolesListComponent },
  { path: 'admin/roles/new', component: RoleFormComponent },
  { path: 'admin/roles/:id', component: RoleFormComponent },
  { path: '**', redirectTo: 'admin/roles' },
  { path: 'time-off', component: TimeOffComponent}
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
  })

  export class AppRoutingModule{
  }