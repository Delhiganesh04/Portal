// src/app/services/inquiry.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private apiUrl = 'http://localhost:3000/inquiries';

  constructor(private http: HttpClient) { }

  getInquiries(customerId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any[]>(this.apiUrl, { customerId }, { headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}