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
  private apiUrl = 'http://localhost:3000'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  getPayslips(customerId: string): Observable<Payslip[]> {
    return this.http.post<Payslip[]>(`${this.apiUrl}/payslip-data`, { id: customerId });
  }

  downloadPdf(employeeId: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/payslippdf`, { IPno: employeeId }, {
      responseType: 'blob'
    });
  }

  sendPayslipByEmail(employeeId: string, toEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-payslip`, {
      employeeId,
      to: toEmail,
      from: 'delhiiganesh29@gmail.com'
    });
  }
}