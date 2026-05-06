import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { DailyStatusComponent } from './components/daily-status/daily-status.component';
import { CertificationComponent } from './components/certification/certification.component';
import { TrainingComponent } from './components/training/training.component';
import { LearningComponent } from './components/learning/learning.component';
import { AdminComponent } from './components/admin/theme-mangment/admin.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsOverviewComponent } from './components/projects-overview/projects-overview.component';
import { TeamSummaryComponent } from './components/team-summary/team-summary.component';
import { TeamAdminComponent } from './components/team-admin/team-admin.component';
import { RolesListComponent } from './components/admin/roles/role-list/roles-list.component';
import { RoleFormComponent } from './components/admin/roles/role-form/role-form.component'
import { TimeOffComponent } from './components/time-off/time-off.component';
import { AuthGuard } from './auth.guard';
import { GameLandingComponent } from './components/game-landing/game-landing.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  {
    path: 'daily-status',
    component: DailyStatusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/teams',
    component: TeamAdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/roles',
    component: RolesListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/roles/new',
    component: RoleFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/roles/:id',
    component: RoleFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'projects',
    component: ProjectsOverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'team-summary',
    component: TeamSummaryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'time-off',
    component: TimeOffComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'game',
    component: GameLandingComponent
  },
  {
    path: 'blank',
    redirectTo: '/game',
    pathMatch: 'full'
  },
  // ✅ Certification & Training
  { path: 'certification', component: CertificationComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'learning', component: LearningComponent },
  // fallback
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
