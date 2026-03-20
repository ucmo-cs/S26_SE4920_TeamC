import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private user: any = null;

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('authToken');
    if (this.token) {
      this.decodeToken();
    }
  }

  async login(username: string, password: string): Promise<Observable<boolean>> {
    const response = await fetch(environment.rocApiUrl + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json());
        
    return new Observable<boolean>((observer) => {
      if (response.auth && response.sessionToken) {
        this.token = response.sessionToken;
        localStorage.setItem('authToken', this.token!);
        this.decodeToken();
        observer.next(true);
        observer.complete();
      } else {
        observer.error('Login failed');
      }
    });
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): any {
    return this.user;
  }

  hasRole(role: string): boolean {
    return this.user && this.user.roles && this.user.roles.includes(role);
  }

  private decodeToken() {
    if (this.token) {
      try {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        this.user = payload;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout();
      }
    }
  }
}