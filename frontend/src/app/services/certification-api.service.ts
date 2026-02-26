import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CertificationApiService {
  private baseUrl = `${environment.rocApiUrl}/certifications`;
  constructor(private http: HttpClient) {}

  listByUser(userId: string) {
    return this.http.get<{ items: any[] }>(`${this.baseUrl}?userId=${encodeURIComponent(userId)}`);
  }

  create(payload: any) {
    return this.http.post<{ item: any }>(this.baseUrl, payload);
  }

  delete(uuid: string) {
    return this.http.delete(`${this.baseUrl}/${uuid}`);
  }
}