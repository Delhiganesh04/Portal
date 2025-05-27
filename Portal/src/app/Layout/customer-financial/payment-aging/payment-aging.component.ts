import { Component, OnInit } from '@angular/core';
import { PaymentService } from './payment.service';
import { PaymentItem } from './payment-item';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { CustidService } from '../../../custid.service';

@Component({
  selector: 'app-payment-aging',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <!-- components/payment/payment.component.html -->
<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Payment Aging</h1>
  
  <!-- Filters -->
  <div class="bg-white rounded-lg shadow p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input 
          [formControl]="searchControl"
          type="text" 
          placeholder="Document, Invoice..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      
      <!-- Currency Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <select 
          [formControl]="currencyFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">All Currencies</option>
          <option *ngFor="let currency of getUniqueCurrencies()" [value]="currency">{{currency}}</option>
        </select>
      </div>
      
      <!-- Document Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
        <select 
          [formControl]="documentTypeFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">All Types</option>
          <option *ngFor="let type of getUniqueDocumentTypes()" [value]="type">{{type}}</option>
        </select>
      </div>
      
      <!-- Aging Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Aging</label>
        <select 
          [formControl]="agingFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">All Aging</option>
          <option value="30">0-30 days</option>
          <option value="60">31-60 days</option>
          <option value="90">61-90 days</option>
          <option value="90+">90+ days</option>
        </select>
      </div>
      </div>
        <div class="mt-4 flex justify-end">
    <button 
      (click)="resetFilters()"
      [disabled]="!areFiltersActive"
      class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
      Reset Filters
    </button>
  </div>
    
  </div>
  
  <!-- Loading State -->
  <div *ngIf="isLoading" class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
  
  <!-- Error State -->
  <div *ngIf="error && !isLoading" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
    <p>{{ error }}</p>
  </div>
  
  <!-- Empty State -->
  <div *ngIf="!isLoading && !error && filteredData.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
    <p class="text-gray-500">No payment records found matching your criteria.</p>
  </div>
     <!-- Results Count -->
  <div class="text-sm text-gray-600 mb-4 py-4">
    Showing {{ filteredData.length }} of {{ paymentData.length }} Payment
  </div>
  <!-- Payment Cards -->
  <div class="grid grid-cols-1 gap-4 custom-scroll-container">
    <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> -->
    <div 
      *ngFor="let payment of filteredData"
      (click)="openDetails(payment)"
      class="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow duration-200">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-medium text-lg">Document: {{ payment.Belnr }}</h3>
          <p class="text-gray-600">Invoice: {{ payment.Vbeln }}</p>
          <p class="text-gray-600">Amount: {{ payment.Wrbtr }} {{ payment.Waers }}</p>
        </div>
        <div>
          <span 
            class="px-3 py-1 rounded-full text-sm font-medium"
            [ngClass]="getAgingColor(payment.aging || 0)">
            {{ payment.aging }} days
          </span>
        </div>
      </div>
      <div class="mt-2 flex justify-between text-sm text-gray-500">
        <span>Billing Date: {{ payment.Bldat }}</span>
        <span>Payment Date: {{ payment.Zfbdt }}</span>
      </div>
    </div>
  </div>
  
  <!-- Payment Detail Modal -->
  <div 
    *ngIf="selectedPayment"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50  cursor-pointer"
    (click)="closeDetails()">
    <div 
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      (click)="$event.stopPropagation()">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold">Payment Details</h2>
          <button 
            (click)="closeDetails()"
            class="text-gray-500 hover:text-gray-700 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
       <div class="overflow-y-auto custom-modal-scroll p-6"> 
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded">
            <h3 class="font-medium text-gray-900 mb-2">Basic Information</h3>
            <div class="space-y-2">
              <p><span class="text-gray-600">Customer:</span> {{ selectedPayment.Kunnr }}</p>
              <p><span class="text-gray-600">Company Code:</span> {{ selectedPayment.Bukrs }}</p>
              <p><span class="text-gray-600">Document Number:</span> {{ selectedPayment.Belnr }}</p>
              <p><span class="text-gray-600">Fiscal Year:</span> {{ selectedPayment.Gjahr }}</p>
              <p><span class="text-gray-600">Line Item:</span> {{ selectedPayment.Buzei }}</p>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded">
            <h3 class="font-medium text-gray-900 mb-2">Financial Information</h3>
            <div class="space-y-2">
              <p><span class="text-gray-600">Amount:</span> {{ selectedPayment.Wrbtr }} {{ selectedPayment.Waers }}</p>
              <p><span class="text-gray-600">Tax Code:</span> {{ selectedPayment.Mwskz }}</p>
              <p><span class="text-gray-600">Document Type:</span> {{ selectedPayment.Blart }}</p>
              <p><span class="text-gray-600">Aging:</span> 
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  [ngClass]="getAgingColor(selectedPayment.aging || 0)">
                  {{ selectedPayment.aging }} days
                </span>
              </p>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded">
            <h3 class="font-medium text-gray-900 mb-2">Dates</h3>
            <div class="space-y-2">
              <p><span class="text-gray-600">Billing Date:</span> {{ selectedPayment.Bldat }}</p>
              <p><span class="text-gray-600">Payment Date:</span> {{ selectedPayment.Zfbdt }}</p>
              <p><span class="text-gray-600">Posting Date:</span> {{ selectedPayment.Budat }}</p>
              <p><span class="text-gray-600">Entry Date:</span> {{ selectedPayment.Cpudt }}</p>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded">
            <h3 class="font-medium text-gray-900 mb-2">References</h3>
            <div class="space-y-2">
              <p><span class="text-gray-600">Invoice:</span> {{ selectedPayment.Vbeln }}</p>
              <p><span class="text-gray-600">Clearing Document:</span> {{ selectedPayment.Augbl }}</p>
              <p><span class="text-gray-600">Period:</span> {{ selectedPayment.Monat }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  `,
  styles: `
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Custom scroll container for the inquiries grid */
.custom-scroll-container {
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.custom-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scroll-container::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
}

.custom-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}

/* Custom scroll for modal content */
.custom-modal-scroll {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.custom-modal-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-modal-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-modal-scroll::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
}

.custom-modal-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}

/* Modal overlay */
.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}`
})
export class PaymentAgingComponent implements OnInit {
  paymentData: PaymentItem[] = [];
  filteredData: PaymentItem[] = [];
  selectedPayment: PaymentItem | null = null;
  isLoading = false;
  error: string | null = null;
  customerId = ''

  // Filter controls
  searchControl = new FormControl('');
  currencyFilter = new FormControl('all');
  documentTypeFilter = new FormControl('all');
  agingFilter = new FormControl('all');

  constructor(private paymentService: PaymentService,
              private custid: CustidService
  ) {}

  ngOnInit(): void {
    this.customerId = this.custid.getCustomerId()
    this.loadPaymentData(this.customerId);
    
    // Set up filter changes
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.currencyFilter.valueChanges.subscribe(() => this.applyFilters());
    this.documentTypeFilter.valueChanges.subscribe(() => this.applyFilters());
    this.agingFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  loadPaymentData(customerId: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.paymentService.getPaymentData(customerId).subscribe({
      next: (data) => {
        this.paymentData = data.map((item: PaymentItem) => ({
          ...item,
          aging: this.calculateAging(item.Bldat, item.Zfbdt)
        }));
        this.filteredData = [...this.paymentData];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load payment data';
        this.isLoading = false;
      }
    });
  }

  calculateAging(bldat: string, zfbdt: string): number {
    const billingDate = new Date(bldat);
    const paymentDate = new Date(zfbdt);
    const diffTime = Math.abs(billingDate.getTime() - paymentDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days
  }

  applyFilters(): void {
    let result = [...this.paymentData];
    
    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      result = result.filter(item => 
        item.Belnr.toLowerCase().includes(searchTerm) ||
        item.Vbeln.toLowerCase().includes(searchTerm) ||
        item.Augbl.toLowerCase().includes(searchTerm) ||
        item.Waers.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply currency filter
    if (this.currencyFilter.value !== 'all') {
      result = result.filter(item => item.Waers === this.currencyFilter.value);
    }
    
    // Apply document type filter
    if (this.documentTypeFilter.value !== 'all') {
      result = result.filter(item => item.Blart === this.documentTypeFilter.value);
    }
    
    // Apply aging filter
    if (this.agingFilter.value !== 'all') {
      const threshold = parseInt(this.agingFilter.value ?? '');
      result = result.filter(item => {
        if (!item.aging) return false;
        if (this.agingFilter.value === '30') return item.aging <= 30;
        if (this.agingFilter.value === '60') return item.aging > 30 && item.aging <= 60;
        if (this.agingFilter.value === '90') return item.aging > 60 && item.aging <= 90;
        return item.aging > 90;
      });
    }
    
    this.filteredData = result;
  }

  openDetails(payment: PaymentItem): void {
    this.selectedPayment = payment;
  }

  closeDetails(): void {
    this.selectedPayment = null;
  }

  getAgingColor(aging: number): string {
    if (aging <= 30) return 'bg-green-100 text-green-800';
    if (aging <= 60) return 'bg-yellow-100 text-yellow-800';
    if (aging <= 90) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  getUniqueCurrencies(): string[] {
    const currencies = this.paymentData.map(item => item.Waers);
    return Array.from(new Set(currencies));
  }

  getUniqueDocumentTypes(): string[] {
    const types = this.paymentData.map(item => item.Blart);
    return Array.from(new Set(types));
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.currencyFilter.setValue('all');
    this.documentTypeFilter.setValue('all');
    this.agingFilter.setValue('all');
  }

  get areFiltersActive(): boolean {
    return !!(
      this.searchControl.value ||
      this.currencyFilter.value !== 'all' ||
      this.documentTypeFilter.value !== 'all' ||
      this.agingFilter.value !== 'all'
    );
  }
}