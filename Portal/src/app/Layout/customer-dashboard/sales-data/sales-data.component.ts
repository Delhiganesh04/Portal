import { Component, OnInit } from '@angular/core';
import { SalesOrder } from './sales-order';
import { SalesOrderService } from './sales-order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustidService } from '../../../custid.service';

@Component({
  selector: 'app-sales-data',
  imports: [CommonModule, FormsModule],
  template: `
<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-8">Sales Orders</h1>

  <!-- Filter Section -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search by Product Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
        <input
          type="text"
          [(ngModel)]="searchText"
          (input)="applyFilters()"
          placeholder="Product name..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
      </div>

      <!-- Order Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
        <select
          [(ngModel)]="selectedStatus"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option *ngFor="let status of statusTypes" [value]="status.value">{{ status.text }}</option>
        </select>
      </div>

      <!-- Date Range Filters -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
        <input
          type="date"
          [(ngModel)]="fromDate"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
        <input
          type="date"
          [(ngModel)]="toDate"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
    </div>
    
    <!-- Additional Filters Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <!-- PO Number Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
        <input
          type="text"
          [(ngModel)]="orderNumber"
          (input)="applyFilters()"
          placeholder="Order No #"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
      </div>

      <!-- Document Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
        <select
          [(ngModel)]="selectedDocType"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option *ngFor="let type of docTypes" [value]="type">{{ type }}</option>
        </select>
      </div>

      <!-- Delivery Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Status</label>
        <select
          [(ngModel)]="selectedDeliveryStatus"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option *ngFor="let status of deliveryStatusTypes" [value]="status.value">{{ status.text }}</option>
        </select>
      </div>
    </div>
    
    <!-- Reset Filters Button -->
    <div class="mt-4 flex justify-end">
      <button
        (click)="resetFilters()"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
      >
        Reset Filters
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
  <div *ngIf="!isLoading && !error" class="mt-4 text-sm text-gray-500">
    Showing {{ filteredOrders.length }} of {{ salesOrders.length }} orders
  </div>

  <!-- No Results State -->
  <div *ngIf="!isLoading && !error && filteredOrders.length === 0" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
    No sales orders match your filter criteria.
  </div>

  <!-- Sales Orders Grid with Scrollable Container -->
  <div *ngIf="!isLoading && !error && filteredOrders.length > 0" 
       class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scroll-container">
    <div 
      *ngFor="let order of filteredOrders" 
      (click)="selectOrder(order)"
      class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-800 truncate">{{ order.Arktx }}</h3>
          <span class="text-xs px-2 py-1 rounded-full" 
                [ngClass]="getStatusBadgeClass(order.Gbstk)">
            {{ getStatusText(order.Gbstk) }}
          </span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Order #:</span>
          <span class="ml-2">{{ order.Vbeln }}-{{ order.Posnr }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">PO #:</span>
          <span class="ml-2">{{ order.Bstnk || 'N/A' }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Date:</span>
          <span class="ml-2">{{ formatDate(order.Erdat) }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Qty:</span>
          <span class="ml-2">{{ order.Kwmeng }} {{ order.Vrkme }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm">
          <span class="font-medium">Amount:</span>
          <span class="ml-2">{{ order.Netwr }} {{ order.Waerk }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Detailed View -->
  <div *ngIf="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Sales Order Details</h2>
          <button 
            (click)="closeModal()"
            class="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="overflow-y-auto custom-modal-scroll p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Product Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Material #:</span>
                <span class="font-medium">{{ selectedOrder.Matnr }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Description:</span>
                <span class="font-medium">{{ selectedOrder.Arktx }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Quantity:</span>
                <span class="font-medium">{{ selectedOrder.Kwmeng }} {{ selectedOrder.Vrkme }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Net Value:</span>
                <span class="font-medium">{{ selectedOrder.Netwr }} {{ selectedOrder.Waerk }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Position:</span>
                <span class="font-medium">{{ selectedOrder.Posnr }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Order Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Order #:</span>
                <span class="font-medium">{{ selectedOrder.Vbeln }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Document Type:</span>
                <span class="font-medium">{{ selectedOrder.Auart }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Created On:</span>
                <span class="font-medium">{{ formatDate(selectedOrder.Erdat) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Customer #:</span>
                <span class="font-medium">{{ selectedOrder.Kunnr }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Purchase Order:</span>
                <span class="font-medium">{{ selectedOrder.Bstnk || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Delivery Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Delivery Date:</span>
                <span class="font-medium">{{ formatDate(selectedOrder.VdatuAna) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Delivery Status:</span>
                <span class="font-medium">{{ getStatusText(selectedOrder.Lfgsk) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Storage Location:</span>
                <span class="font-medium">{{ selectedOrder.Lgort || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Status Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Overall Status:</span>
                <span class="font-medium">{{ getStatusText(selectedOrder.Gbstk) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Division:</span>
                <span class="font-medium">{{ selectedOrder.Spart }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-gray-200 flex justify-end">
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
export class SalesDataComponent implements OnInit {
  salesOrders: SalesOrder[] = [];
  filteredOrders: SalesOrder[] = [];
  selectedOrder: SalesOrder | null = null;
  isLoading = false;
  error: string | null = null;
  
  // Filter properties
  searchText = '';
  selectedStatus = '';
  selectedDocType = '';
  selectedDeliveryStatus = '';
  fromDate = '';
  toDate = '';
  poNumber = '';
  orderNumber=''
  
  // Filter options
  statusTypes = [
    { value: 'A', text: 'Open' },
    { value: 'B', text: 'Partially Processed' },
    { value: 'C', text: 'Completed' }
  ];
  
  deliveryStatusTypes = [
    { value: 'A', text: 'Not Delivered' },
    { value: 'B', text: 'Partially Delivered' },
    { value: 'C', text: 'Completely Delivered' }
  ];
  
  docTypes: string[] = [];

  constructor(private salesOrderService: SalesOrderService,
              private custid: CustidService
  ) { }

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.isLoading = true;
    this.error = null;
    
    const customerId = this.custid.getCustomerId(); 
    
    this.salesOrderService.getSalesOrders(customerId).subscribe({
      next: (data) => {
        this.salesOrders = data;
        this.filteredOrders = [...this.salesOrders];
        
        // Extract unique document types for filter dropdown
        this.docTypes = [...new Set(this.salesOrders.map(o => o.Auart))].sort();
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No Sales-Order Data is Available for this Customer';
        this.isLoading = false;
        console.error('Error loading sales orders:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.salesOrders.filter(order => {
      // Filter by search text (product description)
      const matchesSearch = !this.searchText || 
        order.Arktx.toLowerCase().includes(this.searchText.toLowerCase());
      
      // Filter by order status
      const matchesStatus = !this.selectedStatus || 
        order.Gbstk === this.selectedStatus;
      
      // Filter by document type
      const matchesDocType = !this.selectedDocType || 
        order.Auart === this.selectedDocType;
      
      // Filter by delivery status
      const matchesDeliveryStatus = !this.selectedDeliveryStatus || 
        order.Lfgsk === this.selectedDeliveryStatus;
      
      // Filter by PO number
      const matchesOrdNumber = !this.orderNumber || 
        (order.Vbeln && order.Vbeln.toLowerCase().includes(this.orderNumber.toLowerCase()));
      
      // Filter by date range
      let matchesDateRange = true;
      if (this.fromDate || this.toDate) {
        const orderDate = new Date(order.Erdat);
        const fromDateObj = this.fromDate ? new Date(this.fromDate) : null;
        const toDateObj = this.toDate ? new Date(this.toDate) : null;
        
        if (fromDateObj && orderDate < fromDateObj) {
          matchesDateRange = false;
        }
        if (toDateObj && orderDate > toDateObj) {
          matchesDateRange = false;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDocType && 
             matchesDeliveryStatus && matchesOrdNumber && matchesDateRange;
    });
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedDocType = '';
    this.selectedDeliveryStatus = '';
    this.fromDate = '';
    this.toDate = '';
    this.orderNumber = '';
    this.filteredOrders = [...this.salesOrders];
  }

  selectOrder(order: SalesOrder): void {
    this.selectedOrder = order;
  }

  closeModal(): void {
    this.selectedOrder = null;
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
      case 'A': return 'Open';
      case 'B': return 'Partially Processed';
      case 'C': return 'Completed';
      default: return 'Unknown';
    }
  }
}

