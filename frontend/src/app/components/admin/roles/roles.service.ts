import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role, Permission } from './models';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`);
  }

  getRole(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/roles/${id}`);
  }

  createRole(payload: any): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}/roles`, payload);
  }

  updateRole(id: string, payload: any): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/roles/${id}`, payload);
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/roles/${id}`);
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.baseUrl}/permissions`);
  }
}