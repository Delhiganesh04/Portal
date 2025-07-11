import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptService {
  private apiUrl = 'http://localhost:3000/goodsreceipt';

  constructor(private http: HttpClient) { }

  getGoodsReceipts(accountNo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?accountNo=${accountNo}`);
  }
}