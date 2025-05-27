import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/invoice'; 
   private pdfDownloadUrl = 'http://localhost:3000/downloadInvoice';

  constructor(private http: HttpClient) { }

  getInvoiceData(accountNo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?accountNo=${accountNo}`);
  }

    downloadInvoicePdf(belnr: string): Observable<Blob> {
    return this.http.get(`${this.pdfDownloadUrl}?belnr=${belnr}`, {
      responseType: 'blob'
    });
  }
}