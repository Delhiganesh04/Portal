import { Component,OnInit } from '@angular/core';
import { InvoiceService } from './invoice.service';
import { Invoice } from './invoice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CustidService } from '../../../custid.service';

@Component({
  selector: 'app-invoice-detail',
  imports: [CommonModule,FormsModule],
  template: `
<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Invoice Management</h1>

  <!-- Loading and Error States
  <div *ngIf="isLoading" class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div> -->



  <!-- Filter Section -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <!-- <h2 class="text-xl font-semibold text-gray-700 mb-4">Filters</h2> -->
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search Term -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input type="text" [(ngModel)]="searchTerm" 
               (ngModelChange)="onSearchTermChange($event)"
               placeholder="Invoice no..."
               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
      </div>
      
      <!-- Currency Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <select [(ngModel)]="currencyFilter" 
                (ngModelChange)="onFilterChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="">All Currencies</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
        </select>
      </div>
      
      <!-- Date Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
        <input type="date" [(ngModel)]="dateFilter" 
               (ngModelChange)="onFilterChange()"
               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
      </div>
      
      <!-- Amount Range -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
          <input type="number" [(ngModel)]="amountRange.min" placeholder="Min" 
                 (ngModelChange)="onFilterChange()"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
          <input type="number" [(ngModel)]="amountRange.max" placeholder="Max" 
                 (ngModelChange)="onFilterChange()"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
      </div>
    </div>
    
    <div class="flex justify-end mt-4">
      <button (click)="resetFilters()" 
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
        Reset Filters
      </button>
    </div>
  </div>
  <!-- Loading State -->
  <div *ngIf="isLoading" class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
    <div *ngIf="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
    <p>{{ error }}</p>
  </div>

     <!-- Results Count -->
  <div class="text-sm text-gray-600 mb-4 py-4">
    Showing {{ filteredInvoices.length }} of {{ invoices.length }} Invoices
  </div>
  <!-- Invoice Cards -->
  <div *ngIf="!isLoading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scroll-container">
    <div *ngFor="let invoice of filteredInvoices" 
         (click)="selectInvoice(invoice)"
         class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Invoice #{{ invoice.Vbeln }}</h3>
          <span class="px-2 py-1 text-xs font-semibold rounded-full" 
                [ngClass]="{
                  'bg-green-100 text-green-800': invoice.Waerk === 'EUR',
                  'bg-blue-100 text-blue-800': invoice.Waerk === 'USD',
                  'bg-purple-100 text-purple-800': invoice.Waerk === 'INR'
                }">
            {{ invoice.Waerk }}
          </span>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Date:</span>
            <span class="text-sm font-medium">{{ invoice.Fkdat | date }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Reference:</span>
            <span class="text-sm font-medium">{{ invoice.Xblnr || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Amount:</span>
            <span class="text-sm font-medium">{{ invoice.Netwr }} {{ invoice.Waerk }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Product:</span>
            <span class="text-sm font-medium">{{ invoice.Arktx }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- No Results Message -->
  <div *ngIf="filteredInvoices.length === 0 && !isLoading && !error" 
       class="bg-white rounded-lg shadow-md p-8 text-center">
    <p class="text-gray-500">No invoices found matching your criteria.</p>
  </div>



  <!-- Invoice Detail Modal -->
  <div *ngIf="selectedInvoice" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Invoice Details</h2>
          <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      <div class="overflow-y-auto custom-modal-scroll p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Invoice Number</h3>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvoice.Vbeln }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Invoice Date</h3>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvoice.Fkdat | date }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Created On</h3>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvoice.Erdat | date }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Customer</h3>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvoice.Kunrg }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Document Type</h3>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvoice.Fkart }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Sales Org</h3>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvoice.Vkorg }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Distribution Channel</h3>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvoice.Vtweg }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Division</h3>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvoice.Spart }}</p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Line Items</h3>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-12 gap-4 mb-2 font-medium text-sm text-gray-500">
              <div class="col-span-2">Item</div>
              <div class="col-span-4">Description</div>
              <div class="col-span-2">Quantity</div>
              <div class="col-span-2">Unit</div>
              <div class="col-span-2 text-right">Amount</div>
            </div>
            
            <div class="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 text-sm">
              <div class="col-span-2">{{ selectedInvoice.Posnr }}</div>
              <div class="col-span-4">{{ selectedInvoice.Arktx }}</div>
              <div class="col-span-2">{{ selectedInvoice.Fkimg }}</div>
              <div class="col-span-2">{{ selectedInvoice.Vrkme }}</div>
              <div class="col-span-2 text-right">{{ selectedInvoice.Netwr }} {{ selectedInvoice.Waerk }}</div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
        <!-- <button (click)="closeModal()" 
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer">
          Close
        </button> -->
        <button (click)="downloadPdf(selectedInvoice)" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer">
          Download PDF
        </button>
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
export class InvoiceDetailComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  selectedInvoice: Invoice | null = null;
  isLoading = false;
  error: string | null = null;
  customerId = ''
  // Filter properties
  searchTerm = '';
  currencyFilter = '';
  dateFilter = '';
  amountRange = { min: '', max: '' };

  // For debouncing search input
  private searchTerms = new Subject<string>();

  constructor(private invoiceService: InvoiceService,
              private custid        : CustidService
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
    
    // Setup debounce for search term
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  loadInvoices(): void {
    this.isLoading = true;
    this.error = null;
    
    this.customerId = this.custid.getCustomerId()
    
    this.invoiceService.getInvoices(this.customerId).subscribe({
      next: (response) => {
        this.invoices = response.data;
        this.filteredInvoices = [...this.invoices];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load invoices. Please try again later.';
        this.isLoading = false;
        console.error('Error loading invoices:', err);
      }
    });
  }

  // Trigger filter on input change
  onFilterChange(): void {
    this.applyFilters();
  }

  // Trigger filter with debounce on search term change
  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.searchTerms.next(term);
  }

  selectInvoice(invoice: Invoice): void {
    this.selectedInvoice = invoice;
  }

  closeModal(): void {
    this.selectedInvoice = null;
  }

  applyFilters(): void {
    this.filteredInvoices = this.invoices.filter(invoice => {
      // Search term filter
      const matchesSearch = this.searchTerm === '' || 
        Object.values(invoice).some(val => 
          val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      
      // Currency filter
      const matchesCurrency = this.currencyFilter === '' || 
        invoice.Waerk === this.currencyFilter;
      
      // Date filter
      const matchesDate = this.dateFilter === '' || 
        invoice.Fkdat === this.dateFilter;
      
      // Amount range filter
      const amount = parseFloat(invoice.Netwr);
      const matchesMin = this.amountRange.min === '' || 
        (amount && amount >= parseFloat(this.amountRange.min));
      const matchesMax = this.amountRange.max === '' || 
        (amount && amount <= parseFloat(this.amountRange.max));
      
      return matchesSearch && matchesCurrency && matchesDate && matchesMin && matchesMax;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.currencyFilter = '';
    this.dateFilter = '';
    this.amountRange = { min: '', max: '' };
    this.filteredInvoices = [...this.invoices];
  }

 downloadPdf(invoice: Invoice): void {
    this.invoiceService.downloadPdf(invoice.Vbeln, invoice.Posnr).subscribe({
      next: (blob: Blob) => {
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoice.Vbeln}_${invoice.Posnr}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error downloading PDF:', err);
        alert('Failed to download PDF. Please try again.');
      }
    });
  }
}