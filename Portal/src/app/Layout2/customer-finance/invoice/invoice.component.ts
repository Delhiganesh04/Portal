import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceService } from './invoice.service';
import { CommonModule, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustidVendService } from '../../../custid-vend.service';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  template: `
    <!-- invoice.component.html -->
<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Vendor Invoice Details</h1>
  
  <!-- Filters Section -->
  <div class="bg-white shadow rounded-lg p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input 
          [formControl]="searchControl"
          type="text" 
          placeholder="Search by document, company, PO..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      
      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
        <input 
          type="date" 
          [(ngModel)]="dateRange.start"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
        <input 
          type="date" 
          [(ngModel)]="dateRange.end"
          (change)="applyFilters()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
    </div>
    
    <div class="mt-4 flex justify-end">
      <button 
        (click)="clearFilters()"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer">
        Clear Filters
      </button>
    </div>
  </div>
  
  <!-- Loading and Error States -->
  <div *ngIf="isLoading" class="text-center py-8">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    <p class="mt-2 text-gray-600">Loading data...</p>
  </div>
  
  <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <span class="block sm:inline">{{ errorMessage }}</span>
  </div>
  
  <div class="text-sm text-gray-600 mb-4 py-4">
    Showing {{ filteredData.length }} of {{ invoiceData.length }} invoices
  </div>
  
  <!-- Data Table -->
  <div *ngIf="!isLoading && filteredData.length > 0" class="bg-white shadow rounded-lg overflow-hidden custom-scroll-container">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th *ngFor="let column of displayedColumns" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ column === 'actions' ? 'Action' : column }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let item of filteredData" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex justify-center">
              {{ item.Belnr }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Gjahr }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(item.Bldat) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Bukrs }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Xblnr || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Waers }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Rmwwr }}
            </td>
            <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Wrbtr }}
            </td> -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Menge }} {{ item.Bstme }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                (click)="onDummyAction(item)"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                Invoice
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- Empty State -->
  <div *ngIf="!isLoading && filteredData.length === 0" class="text-center py-12 bg-white shadow rounded-lg">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
    <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
  </div>
</div>
  `,
  styles: `/* invoice.component.css */
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
}`,
providers:[DatePipe]
})
export class InvoiceComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  invoiceData: any[] = [];
  filteredData: any[] = [];
  accountNo=''

  // Table columns
  displayedColumns = ['DocumentNo', 'Year', 'Doc Date', 'Company code', 'Ref DocNO', 'Currency', 'Amount', 'Quantity', 'actions'];

  // Filters
  searchControl = new FormControl('');
  dateRange = {
    start: '',
    end: ''
  };

  constructor(
    private invoiceService: InvoiceService,
    private datePipe: DatePipe,
    private custid:CustidVendService
  ) {}

  ngOnInit(): void {
    // Example account number - you might want to get this from route params or user input
    // const accountNo = '0000100000';
    this.accountNo=this.custid.getCustomerId()
    for(let i=0;i<4;i++){
      this.accountNo='0'+this.accountNo
    }
    console.log(this.accountNo)
    this.loadInvoiceData(this.accountNo);

    // Setup search filter
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());
  }

  loadInvoiceData(accountNo: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.invoiceService.getInvoiceData(accountNo).subscribe(
      (data) => {
        this.invoiceData = data;
        this.filteredData = [...this.invoiceData];
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load invoice data. Please try again later.';
        this.isLoading = false;
        console.error('Error loading invoice data:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const dateStr = dateString.match(/\/Date\((\d+)\)\//);
    if (!dateStr) return dateString;
    
    const date = new Date(parseInt(dateStr[1]));
    return this.datePipe.transform(date, 'dd-MMM-yyyy') || '';
  }

  applyFilters(): void {
    let filtered = [...this.invoiceData];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.Belnr.toLowerCase().includes(searchTerm) ||
        item.Bukrs.toLowerCase().includes(searchTerm) ||
        item.Lifnr.toLowerCase().includes(searchTerm) ||
        item.Ebeln.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date range filter
    if (this.dateRange.start || this.dateRange.end) {
      filtered = filtered.filter(item => {
        const dateStr = item.Bldat.match(/\/Date\((\d+)\)\//);
        if (!dateStr) return false;
        
        const itemDate = new Date(parseInt(dateStr[1])).toISOString().split('T')[0];
        
        if (this.dateRange.start && itemDate < this.dateRange.start) return false;
        if (this.dateRange.end && itemDate > this.dateRange.end) return false;
        
        return true;
      });
    }

    this.filteredData = filtered;
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.dateRange = { start: '', end: '' };
    this.filteredData = [...this.invoiceData];
  }

  // Dummy button action
  onDummyAction(item: any): void {
    // console.log('Dummy action triggered for:', item.Belnr);
    // // Here you can add any dummy functionality you want
    // alert(`Dummy action performed for invoice ${item.Belnr}`);
    this.downloadInvoicePdf(item.Belnr)
  }

  downloadInvoicePdf(belnr: string): void {
    this.invoiceService.downloadInvoicePdf(belnr).subscribe(
      (data: Blob) => {
        // Create a download link
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${belnr}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error downloading PDF:', error);
        alert('Failed to download invoice PDF. Please try again.');
      }
    );
  }
}
