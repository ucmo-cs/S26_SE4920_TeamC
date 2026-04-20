import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private apiBase = environment.rocApiUrl;

  constructor(private http: HttpClient) { }

  public getUserInfo(uuid: string) {
    return firstValueFrom(
      this.http.get(`${this.apiBase}/users/${uuid}`)
    );
  }
  public getUsers() {
    return firstValueFrom(
      this.http.get(`${this.apiBase}/users`)
    );
  }

  public getProjects() {
    return firstValueFrom(
      this.http.get(`${this.apiBase}/projects`)
    );
  }

  public updateUserRoles(uuid: string, roles: string[]) {
    return firstValueFrom(
      this.http.put(`${this.apiBase}/users/${uuid}/roles`, { roles })
    );
  }

  public clearLeaderboard() {
    return firstValueFrom(
      this.http.delete(`${this.apiBase}/leaderboard`)
    );
  }
}