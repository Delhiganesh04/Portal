import { Component , OnInit } from '@angular/core';
import { RfqService, RFQItem } from './req.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CustidVendService } from '../../../custid-vend.service';
@Component({
  selector: 'app-request-quotation',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  template: `
 
  
<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6 text-gray-800">Request for Quotation</h1>
  
  <!-- Vendor Info -->
  <!-- <div class="bg-white shadow rounded-lg p-4 mb-6">
    <h2 class="text-lg font-semibold mb-2 text-gray-700">Vendor Information</h2>
    <p class="text-gray-600">Vendor Number: {{ vendorNo }}</p>
  </div> -->
  
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
          placeholder="PO number or material..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
      
      <!-- Document Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
        <select 
          [(ngModel)]="filterOptions.bsart"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Types</option>
          <option value="AN">AN</option>
          <!-- Add other document types as needed -->
        </select>
      </div>
      
      <!-- Purchasing Org -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Purchasing Org</label>
        <select 
          [(ngModel)]="filterOptions.ekorg"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Organizations</option>
          <option value="PUR1">PUR1</option>
          <!-- Add other purchasing orgs as needed -->
        </select>
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
    
    <div class="mt-4 flex justify-end">
      <button 
        (click)="resetFilters()"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  </div>
  
  <!-- Loading/Error States -->
  <div *ngIf="isLoading" class="text-center py-8">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    <p class="mt-2 text-gray-600">Loading RFQs...</p>
  </div>
  
  <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {{ error }}
  </div>
  
  <div class="text-sm text-gray-600 mb-4 py-4">
    Showing {{ filteredRfqs.length }} of {{ rfqs.length }} RFQs
  </div>
  
  <!-- Results Table -->
  <div *ngIf="!isLoading && !error" class="custom-scroll-container">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let rfq of filteredRfqs" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ rfq.Ebeln }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ rfq.Bsart }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(rfq.Bedat) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="font-medium">{{ rfq.Matnr }}</span> - {{ rfq.Txz01 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ rfq.Menge }} {{ rfq.Meins }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ rfq.Netpr }} {{ rfq.Waers || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button 
                  (click)="selectRfq(rfq)"
                  class="text-indigo-600 hover:text-indigo-900 font-medium cursor-pointer"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="filteredRfqs.length === 0" class="text-center py-8 text-gray-500">
        No RFQs found matching your criteria.
      </div>
    </div>
  </div>
  
  <!-- RFQ Detail Modal -->
  <div *ngIf="selectedRfq" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start">
          <h2 class="text-2xl font-bold text-gray-800">RFQ Details</h2>
          <button 
            (click)="closeDetail()"
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
              <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">RFQ Information</h3>
              <div class="space-y-3">
                <p><span class="text-gray-600 font-medium">PO Number:</span> {{ selectedRfq.Ebeln }}</p>
                <p><span class="text-gray-600 font-medium">Document Type:</span> {{ selectedRfq.Bsart }}</p>
                <p><span class="text-gray-600 font-medium">Vendor:</span> {{ selectedRfq.Lifnr }}</p>
                <p><span class="text-gray-600 font-medium">Purchasing Org:</span> {{ selectedRfq.Ekorg }}</p>
                <p><span class="text-gray-600 font-medium">Purchasing Group:</span> {{ selectedRfq.Ekgrp }}</p>
                <p><span class="text-gray-600 font-medium">Order Date:</span> {{ formatDate(selectedRfq.Bedat) }}</p>
                <p><span class="text-gray-600 font-medium">Created By:</span> {{ selectedRfq.Ernam }}</p>
                <p><span class="text-gray-600 font-medium">Currency:</span> {{ selectedRfq.Waers || 'N/A' }}</p>
              </div>
            </div>
            
            <!-- Right Column -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Item Details</h3>
              <div class="space-y-3">
                <p><span class="text-gray-600 font-medium">Item Number:</span> {{ selectedRfq.Ebelp }}</p>
                <p><span class="text-gray-600 font-medium">Material:</span> {{ selectedRfq.Matnr }}</p>
                <p><span class="text-gray-600 font-medium">Description:</span> {{ selectedRfq.Txz01 }}</p>
                <p><span class="text-gray-600 font-medium">Quantity:</span> {{ selectedRfq.Menge }} {{ selectedRfq.Meins }}</p>
                <p><span class="text-gray-600 font-medium">Net Price:</span> {{ selectedRfq.Waers || 'N/A' }} {{ selectedRfq.Netpr }}</p>
                <p><span class="text-gray-600 font-medium">End Date:</span> {{ selectedRfq.EqEindt || 'N/A' }}</p>
              </div>
            </div>
          </div>
          
          <!-- <div class="mt-6 pt-4 border-t flex justify-end">
            <button 
              (click)="closeDetail()"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div> -->
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
  }
`
})
export class RequestQuotationComponent implements OnInit {
  rfqs: RFQItem[] = [];
  filteredRfqs: RFQItem[] = [];
  selectedRfq: RFQItem | null = null;
  isLoading = false;
  error: string | null = null;
  searchControl = new FormControl('');
  materialControl = new FormControl(''); // Add material control
  vendorNo = '';

  // Filter options
  filterOptions = {
    bsart: '',
    ekorg: '',
    ekgrp: ''
  };

  constructor(
    private rfqService: RfqService,
    private custid: CustidVendService
  ) { }

  ngOnInit(): void {
    this.vendorNo = this.custid.getCustomerId(); 
    for(let i = 0; i < 4; i++) {
      this.vendorNo = '0' + this.vendorNo;
    }
    this.loadRFQs();

    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());

    // Setup material filter with debounce
    this.materialControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());
  }

  loadRFQs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.rfqService.getRFQsByVendor(this.vendorNo).subscribe({
      next: (data) => {
        this.rfqs = data;
        this.filteredRfqs = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load RFQs. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  selectRfq(rfq: RFQItem): void {
    this.selectedRfq = rfq;
  }

  closeDetail(): void {
    this.selectedRfq = null;
  }

  applyFilters(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const materialTerm = this.materialControl.value?.toLowerCase() || '';
    
    this.filteredRfqs = this.rfqs.filter(rfq => {
      // Search filter
      const matchesSearch = 
        rfq.Ebeln.toLowerCase().includes(searchTerm) ||
        rfq.Matnr.toLowerCase().includes(searchTerm) ||
        rfq.Txz01.toLowerCase().includes(searchTerm);
      
      // Material filter
      const matchesMaterial = !materialTerm || 
        rfq.Matnr.toLowerCase().includes(materialTerm);
      
      // Dropdown filters
      const matchesBsart = !this.filterOptions.bsart || rfq.Bsart === this.filterOptions.bsart;
      const matchesEkorg = !this.filterOptions.ekorg || rfq.Ekorg === this.filterOptions.ekorg;
      const matchesEkgrp = !this.filterOptions.ekgrp || rfq.Ekgrp === this.filterOptions.ekgrp;
      
      return matchesSearch && matchesMaterial && matchesBsart && matchesEkorg && matchesEkgrp;
    });
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.materialControl.setValue(''); // Reset material filter
    this.filterOptions = {
      bsart: '',
      ekorg: '',
      ekgrp: ''
    };
    this.applyFilters();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(parseInt(dateString.match(/\d+/)?.[0] || '0'));
    return date.toLocaleDateString();
  }
}