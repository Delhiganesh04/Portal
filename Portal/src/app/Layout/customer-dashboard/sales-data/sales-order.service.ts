// src/app/services/sales-order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SalesOrder } from './sales-order';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private apiUrl = 'http://localhost:3000/sales-orders'; // Replace with your actual Node.js server URL

  constructor(private http: HttpClient) { }

  getSalesOrders(customerId: string): Observable<SalesOrder[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<SalesOrder[]>(this.apiUrl, { customerId }, { headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}