import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SalesData } from './sales-data';

@Injectable({
  providedIn: 'root'
})
export class SalesDataService {
  private apiUrl = 'http://localhost:3000/overallsales'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getOverallSales(customerId: string): Observable<SalesData[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<SalesData[]>(this.apiUrl, { customerId }, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching sales data:', error);
          return throwError(() => new Error('Failed to fetch sales data'));
        })
      );
  }
}