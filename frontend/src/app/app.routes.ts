import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DailyStatusComponent } from './components/daily-status/daily-status.component';

// NEW pages we will create below
import { CertificationComponent } from './components/certification/certification.component';
import { TrainingComponent } from './components/training/training.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'daily-status', component: DailyStatusComponent },

  // ✅ Certification & Training
  { path: 'certification', component: CertificationComponent },
  { path: 'training', component: TrainingComponent },

  // fallback
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}