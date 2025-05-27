import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreditDebitMemo } from './credit-debit-memo';

@Injectable({
  providedIn: 'root'
})
export class CreditDebitMemoService {

  private apiUrl = 'http://localhost:3000/creddebs'; // Replace with your actual Node.js server URL

  constructor(private http: HttpClient) { }

  getCreditDebits(customerId: string): Observable<CreditDebitMemo[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<CreditDebitMemo[]>(this.apiUrl, { customerId }, { headers }).pipe(
      map((response: any) => {
        // Transform the response if needed
        return response;
      })
    );
  }
}
