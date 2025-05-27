import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RFQItem {
  __metadata?: {
    id: string;
    uri: string;
    type: string;
  };
  Ebeln: string;
  Bsart: string;
  Lifnr: string;
  Ekorg: string;
  Ekgrp: string;
  Bedat: string;
  Ernam: string;
  Ebelp: string;
  Matnr: string;
  Txz01: string;
  Menge: string;
  Meins: string;
  Netpr: string;
  EqEindt: string;
  Waers: string;
}

@Injectable({
  providedIn: 'root'
})
export class RfqService {
  private apiUrl = 'http://localhost:3000/reqforqot';

  constructor(private http: HttpClient) { }

  getRFQsByVendor(vendorNo: string): Observable<RFQItem[]> {
    return this.http.get<RFQItem[]>(`${this.apiUrl}?vendorNo=${vendorNo}`);
  }
}