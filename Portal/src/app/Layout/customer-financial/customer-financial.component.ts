import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-customer-financial',
  imports: [ButtonComponent],
  template: `
  <div class="p-6 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center">Customer Financial Sheet</h2>
    <div class="space-y-6">

      <!-- Invoice Details -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-semibold">Invoice Details</h3>
          <img src="./assets/invoice.png" alt="Invoice" class="w-15 h-15">
        </div>
        <p class="text-gray-600">View all invoice records between the customer and company.</p>
        <app-button title="Invoice" (btnClicked)="navigateTo('invoice')" />
      </div>

      <!-- Payments and Aging -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-semibold">Payments and Aging</h3>
          <img src="./assets/payment.png" alt="Payments" class="w-15 h-15">
        </div>
        <p class="text-gray-600">Track customer payments and account aging.</p>
        <app-button title="Payment" (btnClicked)="navigateTo('payment')" />
      </div>

      <!-- Credit/Debit Memo -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-semibold">Credit/Debit Memo</h3>
          <img src="./assets/credit-card.png" alt="Memo" class="w-15 h-15">
        </div>
        <p class="text-gray-600">Review all credit and debit memos issued for the customer.</p>
        <app-button title="Memo" (btnClicked)="navigateTo('credit-debit')" />
      </div>

      <!-- Overall Sales Data -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-semibold">Overall Sales Data</h3>
          <img src="./assets/salesdata.png" alt="Sales" class="w-15 h-15">
        </div>
        <p class="text-gray-600">Get a summary of total sales and revenue generated from the customer.</p>
        <app-button title="Sales Data" (btnClicked)="navigateTo('overall-salesdata')" />
      </div>

    </div>
  </div>
  `,
  styles: ``
})
export class CustomerFinancialComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate(['layout/customer-financial', route]);
  }
}