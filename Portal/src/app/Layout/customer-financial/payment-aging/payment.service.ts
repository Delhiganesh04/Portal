import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/payage'; 

  constructor(private http: HttpClient) { }

  getPaymentData(customerId: string): Observable<any> {
    return this.http.post(this.apiUrl, { customerId });
  }
}