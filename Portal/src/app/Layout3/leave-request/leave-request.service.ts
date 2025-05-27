import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveRequest {
  Pernr: string;
  Begda: string;
  Endda: string;
  Subty: string;
  Aedtm: string;
  Abwtg: string;
  Umsch: string;
  Ktart: string;
  Anzhl: string;
  Desta: string;
  Deend: string;
}

interface LeaveResponse {
  leaves: LeaveRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private apiUrl = 'http://localhost:3000/emp_leave';

  constructor(private http: HttpClient) { }

  getLeaveRequests(id: string): Observable<LeaveResponse> {
    return this.http.post<LeaveResponse>(this.apiUrl, { id });
  }
}