import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustidService {

    private customerId: string = '';

  setCustomerId(id: string): void {
    this.customerId = id;
    localStorage.setItem('customerId', id); 
  }

  getCustomerId(): string {
    if (!this.customerId) {
      this.customerId = localStorage.getItem('customerId') || '';
    }
    return this.customerId;
  }

  clearCustomerId(): void {
    this.customerId = '';
    localStorage.removeItem('customerId'); 
  }
}
