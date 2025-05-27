import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PurchaseOrderService } from './purchase-order.service';
import { CustidVendService } from '../../../custid-vend.service';

@Component({
  selector: 'app-purchase-goods',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  template: `
<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6 text-gray-800">Purchase Orders</h1>
  
  <!-- Filters -->
  <div class="bg-white shadow rounded-lg p-4 mb-6">
    <h2 class="text-lg font-semibold mb-4 text-gray-700">Filters</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input 
          type="text" 
          [formControl]="searchControl" 
          placeholder="PO number or description..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
      
      <!-- Date From -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
        <input 
          type="date" 
          [formControl]="dateFromControl"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
      
      <!-- Date To -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
        <input 
          type="date" 
          [formControl]="dateToControl"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
      
      <!-- Material -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Material</label>
        <input 
          type="text" 
          [formControl]="materialControl" 
          placeholder="Material number..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
    </div>
    
    <div class="mt-4 flex justify-between items-center">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
        <select 
          [formControl]="statusFilter"
          class="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="NB">Standard PO</option>
          <option value="FO">Framework Order</option>
        </select>
      </div>
      
      <button 
        (click)="resetFilters()"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  </div>
  
  <!-- Loading/Error State -->
  <div *ngIf="isLoading" class="text-center py-8">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    <p class="mt-2 text-gray-600">Loading purchase orders...</p>
  </div>
  
  <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {{ errorMessage }}
  </div>
  
  <div class="text-sm text-gray-600 mb-4 py-4">
    Showing {{ filteredOrders.length }} of {{ purchaseOrders.length }} Purchase Orders
  </div>
  
  <!-- Results Table -->
  <div *ngIf="!isLoading && !errorMessage" class="custom-scroll-container">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of filteredOrders" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.Ebeln }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.Bsart }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.Bedat) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.Matnr }} - {{ order.Txz01 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.Menge }} {{ order.Meins }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button 
                  (click)="openModal(order)"
                  class="text-indigo-600 hover:text-indigo-900 font-medium cursor-pointer"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="filteredOrders.length === 0" class="text-center py-8 text-gray-500">
        No purchase orders found matching your criteria.
      </div>
    </div>
  </div>
  
  <!-- Purchase Order Detail Modal -->
  <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 custom-modal-scroll">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start">
          <h2 class="text-2xl font-bold text-gray-800">Purchase Order Details</h2>
          <button 
            (click)="closeModal()"
            class="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      
        <div class="overflow-y-auto custom-modal-scroll p-6">  
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Order Information</h3>
              <div class="space-y-3">
                <p><span class="text-gray-600 font-medium">PO Number:</span> {{ selectedOrder.Ebeln }}</p>
                <p><span class="text-gray-600 font-medium">Order Type:</span> {{ selectedOrder.Bsart }}</p>
                <p><span class="text-gray-600 font-medium">Vendor:</span> {{ selectedOrder.Lifnr }}</p>
                <p><span class="text-gray-600 font-medium">Purch Org:</span> {{ selectedOrder.Ekorg }}</p>
                <p><span class="text-gray-600 font-medium">Purch Group:</span> {{ selectedOrder.Ekgrp }}</p>
                <p><span class="text-gray-600 font-medium">Order Date:</span> {{ formatDate(selectedOrder.Bedat) }}</p>
                <p><span class="text-gray-600 font-medium">Created By:</span> {{ selectedOrder.Ernam }}</p>
              </div>
            </div>
            
            <!-- Right Column -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Item Details</h3>
              <div class="space-y-3">
                <p><span class="text-gray-600 font-medium">PO Item:</span> {{ selectedOrder.Ebelp }}</p>
                <p><span class="text-gray-600 font-medium">Material:</span> {{ selectedOrder.Matnr }}</p>
                <p><span class="text-gray-600 font-medium">Description:</span> {{ selectedOrder.Txz01 }}</p>
                <p><span class="text-gray-600 font-medium">Quantity:</span> {{ selectedOrder.Menge }} {{ selectedOrder.Meins }}</p>
                <p><span class="text-gray-600 font-medium">Net Price:</span> {{ selectedOrder.Waers }} {{ selectedOrder.Netpr }}</p>
                <p><span class="text-gray-600 font-medium">Plant:</span> {{ selectedOrder.Werks }}</p>
                <p><span class="text-gray-600 font-medium">Schedule Line Date:</span> {{ selectedOrder.EqEindt || 'N/A' }}</p>
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
export class PurchaseGoodsComponent implements OnInit {
  purchaseOrders: any[] = [];
  filteredOrders: any[] = [];
  selectedOrder: any = null;
  showModal = false;
  isLoading = false;
  errorMessage = '';
  accNo=''

  // Filters
  searchControl = new FormControl('');
  dateFromControl = new FormControl('');
  dateToControl = new FormControl('');
  materialControl = new FormControl('');
  statusFilter = new FormControl('all');

  constructor(private purchaseOrderService: PurchaseOrderService,
              private custid:CustidVendService
  ) { }

  ngOnInit(): void {
    this.accNo=this.custid.getCustomerId()
    for(let i=0;i<4;i++){
      this.accNo='0'+this.accNo
    }

    this.loadPurchaseOrders(this.accNo); // Default account number

    // Setup filter observables
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());

    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.dateFromControl.valueChanges.subscribe(() => this.applyFilters());
    this.dateToControl.valueChanges.subscribe(() => this.applyFilters());
    this.materialControl.valueChanges.subscribe(() => this.applyFilters());
  }

  loadPurchaseOrders(accountNo: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.purchaseOrderService.getPurchaseOrders(accountNo).subscribe(
      (data) => {
        this.purchaseOrders = data;
        this.filteredOrders = [...data];
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load purchase orders. Please try again later.';
        this.isLoading = false;
        console.error('Error loading purchase orders:', error);
      }
    );
  }

  openModal(order: any): void {
    this.selectedOrder = order;
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  resetFilters(): void {
    this.searchControl.reset();
    this.dateFromControl.reset();
    this.dateToControl.reset();
    this.materialControl.reset();
    this.statusFilter.setValue('all');
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.purchaseOrders];
    
    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      result = result.filter(order => 
        order.Ebeln.toLowerCase().includes(searchTerm) ||
        order.Matnr.toLowerCase().includes(searchTerm) ||
        order.Txz01.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    const status = this.statusFilter.value;
    if (status !== 'all') {
      result = result.filter(order => order.Bsart === status);
    }

    // Apply material filter
    const material = this.materialControl.value;
    if (material) {
      result = result.filter(order => order.Matnr.includes(material));
    }

    // Apply date range filter
    const dateFrom = this.dateFromControl.value;
    const dateTo = this.dateToControl.value;
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom).setHours(0, 0, 0, 0);
      result = result.filter(order => {
        const orderDate = new Date(parseInt(order.Bedat.match(/\d+/)[0])).setHours(0, 0, 0, 0);
        return orderDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo).setHours(23, 59, 59, 999);
      result = result.filter(order => {
        const orderDate = new Date(parseInt(order.Bedat.match(/\d+/)[0])).setHours(0, 0, 0, 0);
        return orderDate <= toDate;
      });
    }

    this.filteredOrders = result;
  }

  formatDate(sapDate: string): string {
    if (!sapDate) return 'N/A';
    const match = sapDate.match(/\d+/);
    if (!match) return 'N/A';
    const timestamp = parseInt(match[0]);
    return new Date(timestamp).toLocaleDateString();
  }
}