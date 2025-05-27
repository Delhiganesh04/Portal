import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  imports: [ButtonComponent, RouterOutlet],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6 text-center">Customer Dashboard</h2>
      <div class="space-y-6">
        <!-- Inquiry Data Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div class="flex justify-between items-center">  <!-- Changed from items-start to items-center -->
            <div>
              <h3 class="text-xl font-semibold mb-2">Inquiry Data</h3>
              <p class="text-gray-600">View all your inquiries and their status.</p>
            </div>
            <img src="./assets/enquiry.png" alt="Inquiries" class="w-15 h-15">
          </div>
          <app-button title="View Inquiries" (btnClicked)="navigateTo('inquiries')" class="mt-4"/>
        </div>

        <!-- Sale Order Data Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div class="flex justify-between items-center">  <!-- Changed from items-start to items-center -->
            <div>
              <h3 class="text-xl font-semibold mb-2">Sale Order Data</h3>
              <p class="text-gray-600">Check your placed orders and order details.</p>
            </div>
            <img src="./assets/department.png" alt="Orders" class="w-15 h-15">
          </div>
          <app-button title="View Orders" (btnClicked)="navigateTo('sales-data')" class="mt-4"/>
        </div>

        <!-- Delivery List Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div class="flex justify-between items-center">  <!-- Changed from items-start to items-center -->
            <div>
              <h3 class="text-xl font-semibold mb-2">List of Delivery</h3>
              <p class="text-gray-600">Track your deliveries and shipping information.</p>
            </div>
            <img src="./assets/fast-delivery.png" alt="Deliveries" class="w-16 h-16">
          </div>
          <app-button title="View Deliveries" (btnClicked)="navigateTo('delivery')" class="mt-4"/>
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
    this.router.navigate(['layout/customer-dashboard', route]);
  }
}