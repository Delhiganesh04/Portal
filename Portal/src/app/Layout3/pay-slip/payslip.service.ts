import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payslip {
  Pernr: string;
  Bukrs: string;
  Kostl: string;
  Stell: string;
  Vorna: string;
  Gesch: string;
  Gbdat: string;
  Natio: string;
  Trfgr: string;
  Trfst: string;
  Bet01: string;
  Lga01: string;
  Waers: string;
  Divgv: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayslipService {
  private apiUrl = 'http://localhost:3000/payslip-data';
  private pdfUrl = 'http://localhost:3000/payslippdf'

  constructor(private http: HttpClient) { }

  getPayslips(id: string): Observable<Payslip[]> {
    return this.http.post<Payslip[]>(this.apiUrl, { id });
  }
     downloadPdf(IPno: string): Observable<Blob> {
    return this.http.post(this.pdfUrl, { IPno }, {
      responseType: 'blob' 
    });
}
}