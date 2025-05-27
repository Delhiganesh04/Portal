import { Component, OnInit } from '@angular/core';
import { Delivery } from './delivery';
import { DeliveryService } from './delivery.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustidService } from '../../../custid.service';

@Component({
  selector: 'app-delivery',
  imports: [CommonModule, FormsModule],
  template: `
<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-8">Delivery Information</h1>

  <!-- Filter Section -->
  <div class="bg-white rounded-lg shadow-md p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input 
          type="text" 
          [(ngModel)]="searchTerm"
          (ngModelChange)="applyFilters()"
          placeholder="Product name..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
      
      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          [(ngModel)]="selectedStatus"
          (ngModelChange)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="A">Not Processed</option>
          <option value="B">Partially Processed</option>
          <option value="C">Completed</option>
        </select>
      </div>
      
      <!-- Date Range Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
        <input 
          type="date" 
          [(ngModel)]="fromDate"
          (ngModelChange)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
        <input 
          type="date" 
          [(ngModel)]="toDate"
          (ngModelChange)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
    </div>
    
    <div class="mt-3 flex justify-end">
      <button 
        (click)="resetFilters()"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2 cursor-pointer"
      >
        Reset
      </button>
    </div>
  </div>

 

  <!-- Loading State -->
  <div *ngIf="isLoading" class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>

  <!-- Error State -->
  <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {{ error }}
  </div>
    <!-- Results Count -->
  <div class="text-sm text-gray-600 mb-4 py-4">
    Showing {{ filteredDeliveries.length }} of {{ deliveries.length }} deliveries
  </div>

  <!-- Deliveries Grid -->
  <div *ngIf="!isLoading && !error" 
  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scroll-container">
    <div 
      *ngFor="let delivery of filteredDeliveries" 
      (click)="selectDelivery(delivery)"
      class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <!-- Rest of your delivery card template remains the same -->
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-800 truncate">{{ delivery.Arktx }}</h3>
          <span class="text-xs px-2 py-1 rounded-full" 
                [ngClass]="getStatusBadgeClass(delivery.Gbstk)">
            {{ getStatusText(delivery.Gbstk) }}
          </span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Delivery #:</span>
          <span class="ml-2">{{ delivery.Vbeln }}-{{ delivery.Posnr }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Type:</span>
          <span class="ml-2">{{ getDeliveryTypeText(delivery.Lfart) }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Date:</span>
          <span class="ml-2">{{ formatDate(delivery.Lfdat) }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Qty:</span>
          <span class="ml-2">{{ delivery.Lfimg }} {{ delivery.Vrkme }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm">
          <span class="font-medium">Amount:</span>
          <span class="ml-2">{{ delivery.Netwr || '0.0' }} {{ delivery.Waerk }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- No Results Message -->
  <div *ngIf="!isLoading && !error && filteredDeliveries.length === 0" class="text-center py-12">
    <p class="text-gray-500">No deliveries match your filter criteria</p>
    <button 
      (click)="resetFilters()"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
    >
      Reset Filters
    </button>
  </div>
 

 <!-- Modal for Detailed View -->
  <div *ngIf="selectedDelivery" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Delivery Details</h2>
          <button 
            (click)="closeModal()"
            class="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      <div class="overflow-y-auto custom-modal-scroll p-6"> 
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Product Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Material #:</span>
                <span class="font-medium">{{ selectedDelivery.Matnr }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Description:</span>
                <span class="font-medium">{{ selectedDelivery.Arktx }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Quantity:</span>
                <span class="font-medium">{{ selectedDelivery.Lfimg }} {{ selectedDelivery.Vrkme }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Net Value:</span>
                <span class="font-medium">{{ selectedDelivery.Netwr || '0.0' }} {{ selectedDelivery.Waerk }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Position:</span>
                <span class="font-medium">{{ selectedDelivery.Posnr }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Delivery Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Delivery #:</span>
                <span class="font-medium">{{ selectedDelivery.Vbeln }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Delivery Type:</span>
                <span class="font-medium">{{ getDeliveryTypeText(selectedDelivery.Lfart) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Delivery Date:</span>
                <span class="font-medium">{{ formatDate(selectedDelivery.Lfdat) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Customer #:</span>
                <span class="font-medium">{{ selectedDelivery.Kunnr }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Status Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Overall Status:</span>
                <span class="font-medium">{{ getStatusText(selectedDelivery.Gbstk) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Picking Status:</span>
                <span class="font-medium">{{ selectedDelivery.Bestk || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Location Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping Point:</span>
                <span class="font-medium">{{ selectedDelivery.Vstel }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Plant:</span>
                <span class="font-medium">{{ selectedDelivery.Werks }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Storage Location:</span>
                <span class="font-medium">{{ selectedDelivery.Lgort || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        <div class="mt-6 flex justify-end">
          <button
            (click)="closeModal()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            Close
          </button>
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
export class DeliveryComponent implements OnInit {
  deliveries: Delivery[] = [];
  filteredDeliveries: Delivery[] = [];
  selectedDelivery: Delivery | null = null;
  isLoading = false;
  error: string | null = null;
  
  // Filter properties
  searchTerm: string = '';
  selectedStatus: string = '';
  fromDate: string = '';
  toDate: string = '';

  constructor(
    private deliveryService: DeliveryService,
    private custid: CustidService
  ) { }

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.isLoading = true;
    this.error = null;
    
    const customerId = this.custid.getCustomerId(); 
    
    this.deliveryService.getDeliveries(customerId).subscribe({
      next: (data) => {
        this.deliveries = data;
        this.filteredDeliveries = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No Delivery data found for this Customer.';
        this.isLoading = false;
        console.error('Error loading deliveries:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredDeliveries = this.deliveries.filter(delivery => {
      // Search term filter
      const matchesSearch = !this.searchTerm || 
        delivery.Matnr.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        delivery.Arktx.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        delivery.Vbeln.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = !this.selectedStatus || 
        delivery.Gbstk === this.selectedStatus;
      
      // Date range filter
      let matchesDate = true;
      if (this.fromDate || this.toDate) {
        const deliveryDate = new Date(delivery.Lfdat);
        const fromDateObj = this.fromDate ? new Date(this.fromDate) : null;
        const toDateObj = this.toDate ? new Date(this.toDate) : null;
        
        if (fromDateObj && deliveryDate < fromDateObj) {
          matchesDate = false;
        }
        if (toDateObj && deliveryDate > toDateObj) {
          matchesDate = false;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.fromDate = '';
    this.toDate = '';
    this.filteredDeliveries = [...this.deliveries];
  }

  // Your existing methods remain the same...
  selectDelivery(delivery: Delivery): void {
    this.selectedDelivery = delivery;
  }

  closeModal(): void {
    this.selectedDelivery = null;
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === '0000-00-00') {
      return 'N/A';
    }
    return new Date(dateString).toLocaleDateString();
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'A': return 'bg-yellow-100 text-yellow-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'A': return 'Not Processed';
      case 'B': return 'Partially Processed';
      case 'C': return 'Completed';
      default: return 'Unknown';
    }
  }

  getDeliveryTypeText(type: string): string {
    switch(type) {
      case 'LF': return 'Standard Delivery';
      default: return type;
    }
  }
}

