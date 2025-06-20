import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth3Service {

    private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(id: string, password: string) {
    return this.http.post<{ message: string, status: string }>(`${this.apiUrl}/login3`, {
      id,
      password
    });
  }
}
