// credit-debit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditDebitService {
  private apiUrl = 'http://localhost:3000/creditdebit'; // Your Node.js endpoint

  constructor(private http: HttpClient) { }

  getCreditDebitData(accountNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?accountNo=${accountNumber}`);
  }
}