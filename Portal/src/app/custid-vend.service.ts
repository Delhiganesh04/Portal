import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustidVendService {

  constructor() { }
  
    private customerId: string = '';

  setCustomerId(id: string): void {
    this.customerId = id;
    localStorage.setItem('accountNo', id); 
  }

  getCustomerId(): string {
    if (!this.customerId) {
      this.customerId = localStorage.getItem('accountNo') || '';
    }
    return this.customerId;
  }

  clearCustomerId(): void {
    this.customerId = '';
    localStorage.removeItem('accountNo'); 
  }
}
