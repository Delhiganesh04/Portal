import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Custid3Service {

     private customerId: string = '';

  setCustomerId(id: string): void {
    this.customerId = id;
    localStorage.setItem('EmployeeId', id); 
  }

  getCustomerId(): string {
    if (!this.customerId) {
      this.customerId = localStorage.getItem('EmployeeId') || '';
    }
    return this.customerId;
  }

  clearCustomerId(): void {
    this.customerId = '';
    localStorage.removeItem('customerId'); 
  }
}
