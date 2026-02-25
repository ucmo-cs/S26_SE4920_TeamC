import { Routes } from '@angular/router';

import { RolesListComponent } from './admin/roles/roles-list/roles-list.component';
import { RoleFormComponent } from './admin/roles/role-form/role-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/roles', pathMatch: 'full' },

  { path: 'admin', redirectTo: 'admin/roles', pathMatch: 'full' },
  { path: 'admin/roles', component: RolesListComponent },
  { path: 'admin/roles/new', component: RoleFormComponent },
  { path: 'admin/roles/:id', component: RoleFormComponent },

  { path: '**', redirectTo: 'admin/roles' }
];