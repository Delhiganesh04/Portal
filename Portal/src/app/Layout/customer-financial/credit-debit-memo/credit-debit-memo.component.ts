import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CreditDebitMemo } from './credit-debit-memo';
import { CreditDebitMemoService } from './credit-debit-memo.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustidService } from '../../../custid.service';

@Component({
  selector: 'app-credit-debit-memo',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- src/app/components/credit-debit/credit-debit.component.html -->
<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Credit/Debit Documents</h1>

<div class="bg-white p-4 rounded-lg shadow-md mb-6">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Search Box -->
    <div>
      <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
      <div class="relative rounded-md shadow-sm">
        <input 
          type="text" 
          id="search" 
          [formControl]="searchControl"
          class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500"
          placeholder="Product name...">
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Document Type Filter -->
    <div>
      <label for="documentType" class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
      <select 
        id="documentType" 
        [formControl]="documentTypeFilter"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
        <option value="all">All Types</option>
        <option value="G2">Credit Memo</option>
        <option value="L2">Debit Memo</option>
      </select>
    </div>

    <!-- Status Filter -->
    <div>
      <label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select 
        id="statusFilter" 
        [formControl]="statusFilter"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
        <option value="all">All Statuses</option>
        <option value="A">Active</option>
        <option value="P">Pending</option>
        <option value="O">Open</option>
      </select>
    </div>

    <!-- Date Range Filter -->
    <div>
      <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
      <select 
        id="dateRange" 
        [formControl]="dateRangeFilter"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
        <option value="all">All Time</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
        <option value="year">This Year</option>
      </select>
    </div>
  </div>
 
 <!-- Add this right after the filter section -->
<div class="mt-3 flex justify-end">
  <button 
    (click)="clearFilters()"
    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2 cursor-pointer"
  >
    Reset
  </button>
</div>
</div>
</div>

  <!-- Loading State -->
  <div *ngIf="isLoading" class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
   <!-- Results Count -->
  <div *ngIf="!isLoading && !error" class="mb-4 text-sm text-gray-600">
    Showing {{ filteredCreditDebits.length }} of {{ creditDebits.length }} documents
  </div>

  <!-- Error State -->
  <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {{ error }}
    <!-- <button (click)="loadCreditDebits()" class="ml-4 text-blue-600 hover:text-blue-800">
      Retry
    </button> -->
  </div>

 

  <!-- Documents Grid -->
  <div *ngIf="!isLoading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scroll-container">
    <div 
      *ngFor="let record of filteredCreditDebits" 
      (click)="selectRecord(record)"
      class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-800 truncate">{{ record.Arktx }}</h3>
          <span class="text-xs px-2 py-1 rounded-full" 
                [ngClass]="getStatusBadgeClass(record.Fktyp)">
            {{ getDocumentStatusText(record.Fktyp) }}
          </span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Document #:</span>
          <span class="ml-2">{{ record.Vbeln }}-{{ record.Posnr }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Type:</span>
          <span class="ml-2">{{ getDocumentTypeText(record.Fkart) }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Date:</span>
          <span class="ml-2">{{ formatDate(record.Fkdat) }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Material #:</span>
          <span class="ml-2">{{ record.Martnr }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm">
          <span class="font-medium">Amount:</span>
          <span class="ml-2">{{ record.Netwr }} {{ record.Waerk }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- No Results Message -->
  <div *ngIf="!isLoading && !error && filteredCreditDebits.length === 0" class="text-center py-8">
    <p class="text-gray-500">No documents match your search criteria</p>
    <button (click)="searchControl.setValue(''); documentTypeFilter.setValue('all')" 
            class="mt-2 text-blue-600 hover:text-blue-800">
      Clear filters
    </button>
  </div>

  <!-- Modal for Detailed View -->
  <div *ngIf="selectedRecord" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Document Details</h2>
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
          <!-- Document Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Document Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Document #:</span>
                <span class="font-medium">{{ selectedRecord.Vbeln }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Position:</span>
                <span class="font-medium">{{ selectedRecord.Posnr }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium">{{ getDocumentTypeText(selectedRecord.Fkart) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium">{{ getDocumentStatusText(selectedRecord.Fktyp) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Document Date:</span>
                <span class="font-medium">{{ formatDate(selectedRecord.Fkdat) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Created On:</span>
                <span class="font-medium">{{ formatDate(selectedRecord.Erdat) }} at {{ formatTime(selectedRecord.Erzet) }}</span>
              </div>
            </div>
          </div>

          <!-- Financial Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Financial Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Amount:</span>
                <span class="font-medium">{{ selectedRecord.Netwr }} {{ selectedRecord.Waerk }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Currency:</span>
                <span class="font-medium">{{ selectedRecord.Waerk }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Exchange Rate:</span>
                <span class="font-medium">{{ selectedRecord.Kurrf || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Sales Org:</span>
                <span class="font-medium">{{ selectedRecord.Vkorg }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Pricing Procedure:</span>
                <span class="font-medium">{{ selectedRecord.Kalsm }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Condition No.:</span>
                <span class="font-medium">{{ selectedRecord.Knumv }}</span>
              </div>
            </div>
          </div>
        
          <!-- Product Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Product Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Material #:</span>
                <span class="font-medium">{{ selectedRecord.Martnr }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Description:</span>
                <span class="font-medium">{{ selectedRecord.Arktx }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Unit of Measure:</span>
                <span class="font-medium">{{ selectedRecord.Vrkme }}</span>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Additional Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Customer #:</span>
                <span class="font-medium">{{ selectedRecord.Kunag }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping Condition:</span>
                <span class="font-medium">{{ selectedRecord.Vsbed || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Reference Document:</span>
                <span class="font-medium">{{ selectedRecord.BstnkVf || 'N/A' }}</span>
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
export class CreditDebitMemoComponent implements OnInit {
  creditDebits: CreditDebitMemo[] = [];
  filteredCreditDebits: CreditDebitMemo[] = [];
  selectedRecord: CreditDebitMemo | null = null;
  isLoading = false;
  error: string | null = null;

  // Form Controls for filters
  searchControl = new FormControl('');
  documentTypeFilter = new FormControl('all');
  statusFilter = new FormControl('all');
  dateRangeFilter = new FormControl('all');

  constructor(
    private creditDebitService: CreditDebitMemoService,
    private custidService: CustidService
  ) { }

  ngOnInit(): void {
    this.loadCreditDebits();
    
    // Setup all filter subscriptions
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());

    this.documentTypeFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.dateRangeFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  loadCreditDebits(): void {
    this.isLoading = true;
    this.error = null;
    
    const customerId = this.custidService.getCustomerId(); 
    
    this.creditDebitService.getCreditDebits(customerId).subscribe({
      next: (data) => {
        this.creditDebits = data;
        this.filteredCreditDebits = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No credit/debit data found for this customer. Please try again later.';
        this.isLoading = false;
        console.error('Error loading credit/debit data:', err);
      }
    });
  }

  selectRecord(record: CreditDebitMemo): void {
    this.selectedRecord = record;
  }

  closeModal(): void {
    this.selectedRecord = null;
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === '0000-00-00') {
      return 'N/A';
    }
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 2) + ':' + timeString.substring(2, 4) + ':' + timeString.substring(4, 6);
  }

  getDocumentTypeText(type: string): string {
    switch(type) {
      case 'G2': return 'Credit Memo';
      case 'L2': return 'Debit Memo';
      default: return type;
    }
  }

  getDocumentStatusText(type: string): string {
    switch(type) {
      case 'A': return 'Active';
      case 'P': return 'Pending';
      case 'O': return 'Open';
      default: return type;
    }
  }

  applyFilters(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const docType = this.documentTypeFilter.value;
    const status = this.statusFilter.value;
    const dateRange = this.dateRangeFilter.value;

    // Calculate date range
    const today = new Date();
    let startDate = new Date(0); // Default to beginning of time

    if (dateRange === '7days') {
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30days') {
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90days') {
      startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (dateRange === 'year') {
      startDate = new Date(today.getFullYear(), 0, 1);
    }

    this.filteredCreditDebits = this.creditDebits.filter(record => {
      // Search filter
      const matchesSearch = 
        record.Vbeln?.toLowerCase().includes(searchTerm) ||
        record.Arktx?.toLowerCase().includes(searchTerm) ||
        record.Martnr?.toLowerCase().includes(searchTerm) ||
        record.Netwr?.toString().includes(searchTerm);

      // Document type filter
      const matchesDocType = docType === 'all' || record.Fkart === docType;

      // Status filter
      const matchesStatus = status === 'all' || record.Fktyp === status;

      // Date range filter
      let matchesDateRange = true;
      if (dateRange !== 'all' && record.Fkdat) {
        const recordDate = new Date(record.Fkdat);
        matchesDateRange = recordDate >= startDate;
      }

      return matchesSearch && matchesDocType && matchesStatus && matchesDateRange;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'P': return 'bg-yellow-100 text-yellow-800';
      case 'O': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.documentTypeFilter.setValue('all');
    this.statusFilter.setValue('all');
    this.dateRangeFilter.setValue('all');
  }
}