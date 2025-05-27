// src/app/services/delivery.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delivery } from './delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:3000/deliveries'; 

  constructor(private http: HttpClient) { }

  getDeliveries(customerId: string): Observable<Delivery[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Delivery[]>(this.apiUrl, { customerId }, { headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}