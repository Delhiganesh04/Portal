import { Component } from '@angular/core';
import { ButtonComponent } from "../../Layout/button/button.component";
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  imports: [ButtonComponent, RouterOutlet],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6 text-center">Vendor Dashboard</h2>
      <div class="space-y-6">
        <!-- Request for Quotation Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-semibold mb-2">Request for Quotation</h3>
              <p class="text-gray-600">Submit and manage your quotation requests.</p>
            </div>
            <img src="./assets/quotation.png" alt="Quotations" class="w-15 h-15">
          </div>
          <app-button title="View Quotations" (btnClicked)="navigateTo('req-qot')" class="mt-4"/>
        </div>

        <!-- Purchase Goods Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-semibold mb-2">Purchase Goods</h3>
              <p class="text-gray-600">Manage your purchase orders and goods.</p>
            </div>
            <img src="./assets/goods.png" alt="Purchases" class="w-15 h-15">
          </div>
          <app-button title="View Purchases" (btnClicked)="navigateTo('pur-goods')" class="mt-4"/>
        </div>

        <!-- Goods Receipt Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-semibold mb-2">Goods Receipt</h3>
              <p class="text-gray-600">Track your received goods and inventory.</p>
            </div>
            <img src="./assets/receipt.png" alt="Goods Receipt" class="w-16 h-16">
          </div>
          <app-button title="View Receipts" (btnClicked)="navigateTo('goods-recipt')" class="mt-4"/>
        </div>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: ``
})
export class CustomerDashboardComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate(['layout2/cust-dash', route]);
  }
}