import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/invoicedata';
  private pdfApiUrl = 'http://localhost:3000/invoicepdf'

  constructor(private http: HttpClient) { }

  getInvoices(customerId: string): Observable<any> {
    return this.http.post(this.apiUrl, { customerId });
  }

   downloadPdf(Docno: string, Itemno: string): Observable<Blob> {
    return this.http.post(this.pdfApiUrl, { Docno, Itemno }, {
      responseType: 'blob' 
    });
  }
}