import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificationApiService {
  private apiUrl = `${environment.apiBaseUrl}/certifications`;

  constructor(private http: HttpClient) {}

  listByUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?userId=${userId}`, {
      headers: this.headers()
    });
  }

  create(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload, {
      headers: this.headers()
    });
  }

  update(uuid: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${uuid}`, payload, {
      headers: this.headers()
    });
  }

  delete(uuid: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${uuid}`, {
      headers: this.headers()
    });
  }

  private headers() {
    const token = localStorage.getItem('auth_token') || '';
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}
