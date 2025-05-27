// payage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayAgeService {
  private apiUrl = 'http://localhost:3000/payage'; // Your Node.js endpoint

  constructor(private http: HttpClient) { }

  getPayageData(accountNo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?accountNo=${accountNo}`);
  }
}