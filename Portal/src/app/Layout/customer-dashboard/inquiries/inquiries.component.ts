import { Component } from '@angular/core';
import { Inquiry } from './inquiries';
import { InquiryService } from './inquiries.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustidService } from '../../../custid.service';

@Component({
  selector: 'app-inquiries',
  imports: [CommonModule, FormsModule],
  template: `
<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-8">Customer Inquiries</h1>

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
          placeholder="Product Name..."
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
    Showing {{ filteredInquiries.length }} of {{ inquiries.length }} inquiries
  </div>

  <!-- No Results State -->
  <div *ngIf="!isLoading && !error && filteredInquiries.length === 0" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
    No inquiries match your filter criteria.
  </div>

  <!-- Inquiries Grid with Scrollable Container -->
  <div *ngIf="!isLoading && !error && filteredInquiries.length > 0" 
       class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scroll-container">
    <div 
      *ngFor="let inquiry of filteredInquiries" 
      (click)="selectInquiry(inquiry)"
      class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-800 truncate">{{ inquiry.Arktx }}</h3>
          <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {{ inquiry.Auart }}
          </span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Order #:</span>
          <span class="ml-2">{{ inquiry.Vbeln }}-{{ inquiry.Posnr }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Date:</span>
          <span class="ml-2">{{ formatDate(inquiry.Erdat) }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm mb-1">
          <span class="font-medium">Qty:</span>
          <span class="ml-2">{{ inquiry.Kwmeng }} {{ inquiry.Vrkme }}</span>
        </div>
        
        <div class="flex items-center text-gray-600 text-sm">
          <span class="font-medium">Amount:</span>
          <span class="ml-2">{{ inquiry.Netwr }} {{ inquiry.Waerk }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Detailed View with Scrollable Content -->
  <div *ngIf="selectedInquiry" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Inquiry Details</h2>
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
                <span class="text-gray-600">Description:</span>
                <span class="font-medium">{{ selectedInquiry.Arktx }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Quantity:</span>
                <span class="font-medium">{{ selectedInquiry.Kwmeng }} {{ selectedInquiry.Vrkme }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Net Value:</span>
                <span class="font-medium">{{ selectedInquiry.Netwr }} {{ selectedInquiry.Waerk }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Position:</span>
                <span class="font-medium">{{ selectedInquiry.Posnr }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Order Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Order #:</span>
                <span class="font-medium">{{ selectedInquiry.Vbeln }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Document Type:</span>
                <span class="font-medium">{{ selectedInquiry.Auart }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Created On:</span>
                <span class="font-medium">{{ formatDate(selectedInquiry.Erdat) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Customer #:</span>
                <span class="font-medium">{{ selectedInquiry.Kunnr }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Dates</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Requested Date:</span>
                  <span class="font-medium">{{ formatDate(selectedInquiry.Angdt) }}</span>
                </div>
              </div>
              <div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Binding End Date:</span>
                  <span class="font-medium">{{ formatDate(selectedInquiry.Bnddt) }}</span>
                </div>
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
export class InquiriesComponent {
  inquiries: Inquiry[] = [];
  filteredInquiries: Inquiry[] = [];
  selectedInquiry: Inquiry | null = null;
  isLoading = false;
  error: string | null = null;
  
  // Filter properties
  searchText = '';
  selectedDocType = '';
  fromDate = '';
  toDate = '';
  docTypes: string[] = [];

  constructor(private inquiryService: InquiryService,
              private custid: CustidService
  ) { }

  ngOnInit(): void {
    this.loadInquiries();
  }

  loadInquiries(): void {
    this.isLoading = true;
    this.error = null;
    
    const customerId = this.custid.getCustomerId();
    
    this.inquiryService.getInquiries(customerId).subscribe({
      next: (data) => {
        this.inquiries = data;
        this.filteredInquiries = [...this.inquiries];
        
        // Extract unique document types for filter dropdown
        this.docTypes = [...new Set(this.inquiries.map(i => i.Auart))].sort();
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No Inquiry Data Found for this Customer';
        this.isLoading = false;
        console.error('Error loading inquiries:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredInquiries = this.inquiries.filter(inquiry => {
      // Filter by search text (product description)
      const matchesSearch = !this.searchText || 
        inquiry.Arktx.toLowerCase().includes(this.searchText.toLowerCase());
      
      // Filter by document type
      const matchesDocType = !this.selectedDocType || 
        inquiry.Auart === this.selectedDocType;
      
      // Filter by date range
      let matchesDateRange = true;
      if (this.fromDate || this.toDate) {
        const inquiryDate = new Date(inquiry.Erdat);
        const fromDateObj = this.fromDate ? new Date(this.fromDate) : null;
        const toDateObj = this.toDate ? new Date(this.toDate) : null;
        
        if (fromDateObj && inquiryDate < fromDateObj) {
          matchesDateRange = false;
        }
        if (toDateObj && inquiryDate > toDateObj) {
          matchesDateRange = false;
        }
      }
      
      return matchesSearch && matchesDocType && matchesDateRange;
    });
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedDocType = '';
    this.fromDate = '';
    this.toDate = '';
    this.filteredInquiries = [...this.inquiries];
  }

  selectInquiry(inquiry: Inquiry): void {
    this.selectedInquiry = inquiry;
  }

  closeModal(): void {
    this.selectedInquiry = null;
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === '0000-00-00') {
      return 'N/A';
    }
    return new Date(dateString).toLocaleDateString();
  }
}


