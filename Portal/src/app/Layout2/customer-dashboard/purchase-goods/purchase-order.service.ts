import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private apiUrl = 'http://localhost:3000/purchaseorder';

  constructor(private http: HttpClient) { }

  getPurchaseOrders(accountNo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?accountNo=${accountNo}`);
  }
}