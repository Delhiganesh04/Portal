// src/app/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

 getProfile(id: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/profile`, { id });
}

}
