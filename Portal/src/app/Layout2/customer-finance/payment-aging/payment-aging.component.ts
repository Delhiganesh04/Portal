import { Component, OnInit } from '@angular/core';
import { PayAgeService } from './pay-age.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule, DatePipe } from '@angular/common';
import { CustidVendService } from '../../../custid-vend.service';


@Component({
  selector: 'app-payment-aging',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  template: `
<!-- payage.component.html -->
<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Vendor Payage Details</h1>
  
  <!-- Filters Section -->
  <div class="bg-white shadow rounded-lg p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input 
          [formControl]="searchControl"
          type="text" 
          placeholder="Search by document, company..."
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
    Showing {{ filteredData.length }} of {{ payageData.length }} documents
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
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ item.Belnr }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Bukrs }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(item.Budat) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Blart }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Wrbtr }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Waers }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span [ngClass]="{
                'bg-green-100 text-green-800': item.Payage <= 30,
                'bg-yellow-100 text-yellow-800': item.Payage > 30 && item.Payage <= 60,
                'bg-red-100 text-red-800': item.Payage > 60
              }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ item.Payage }} days
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                (click)="showDetails(item)"
                class="text-indigo-600 hover:text-indigo-900 flex justify-center cursor-pointer">
                Details
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
    <h3 class="mt-2 text-sm font-medium text-gray-900">No data found</h3>
    <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
  </div>
</div>

<!-- Payage Detail Modal -->
<div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 custom-modal-scroll">
  <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
    <div class="p-6">
      <div class="flex justify-between items-start">
        <h2 class="text-2xl font-bold text-gray-800">Document Details</h2>
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
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Document Information</h3>
            <div class="space-y-3">
              <p><span class="text-gray-600 font-medium">Document Number:</span> {{ selectedItem?.Belnr }}</p>
              <p><span class="text-gray-600 font-medium">Fiscal Year:</span> {{ selectedItem?.Gjahr }}</p>
              <p><span class="text-gray-600 font-medium">Company Code:</span> {{ selectedItem?.Bukrs }}</p>
              <p><span class="text-gray-600 font-medium">Posting Date:</span> {{ formatDate(selectedItem?.Budat) }}</p>
              <p><span class="text-gray-600 font-medium">Document Date:</span> {{ formatDate(selectedItem?.Bldat) }}</p>
              <p><span class="text-gray-600 font-medium">Document Type:</span> {{ selectedItem?.Blart }}</p>
              <p><span class="text-gray-600 font-medium">Created By:</span> {{ selectedItem?.Usnam }}</p>
            </div>
          </div>
          
          <!-- Right Column -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Financial Details</h3>
            <div class="space-y-3">
              <p><span class="text-gray-600 font-medium">Amount:</span> {{ selectedItem?.Wrbtr }} {{ selectedItem?.Waers }}</p>
              <p><span class="text-gray-600 font-medium">Payment Terms:</span> {{ selectedItem?.Zterm || 'N/A' }}</p>
              <p><span class="text-gray-600 font-medium">Vendor:</span> {{ selectedItem?.Lifnr }}</p>
              <p><span class="text-gray-600 font-medium">Currency:</span> {{ selectedItem?.Waers }}</p>
              <p><span class="text-gray-600 font-medium">Clearing Document:</span> {{ selectedItem?.Augbl || 'N/A' }}</p>
              <p><span class="text-gray-600 font-medium">Reference Document:</span> {{ selectedItem?.Rebzg || 'N/A' }}</p>
              <p><span class="text-gray-600 font-medium">Payage:</span> 
                <span [ngClass]="{
                  'bg-green-100 text-green-800': selectedItem?.Payage <= 30,
                  'bg-yellow-100 text-yellow-800': selectedItem?.Payage > 30 && selectedItem?.Payage <= 60,
                  'bg-red-100 text-red-800': selectedItem?.Payage > 60
                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ selectedItem?.Payage }} days
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: `/* payage.component.css */
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
}

.custom-modal-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.custom-modal-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-modal-scroll::-webkit-scrollbar-track {
  background: #f7fafc;
}

.custom-modal-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}

/* Prevent background scrolling when modal is open */
body.modal-open {
  overflow: hidden;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}`,
  providers: [DatePipe]
})
export class PaymentAgingComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  payageData: any[] = [];
  filteredData: any[] = [];
  selectedItem: any = null;
  showModal = false;
  accountNo=''

  // Table columns
  displayedColumns = ['DocumentNo', 'Company Code', 'Creation date', 'TyPe', 'Price', 'Currency', 'Payage', 'actions'];

  // Filters
  searchControl = new FormControl('');
  dateRange = {
    start: '',
    end: ''
  };

  constructor(
    private payageService: PayAgeService,
    private datePipe: DatePipe,
    private custid:CustidVendService
  ) {}

  ngOnInit(): void {
    // Example account number - you might want to get this from route params or user input
    this.accountNo = this.custid.getCustomerId();
    for(let i=0;i<4;i++){
      this.accountNo = '0'+ this.accountNo
    }
    
    this.loadPayageData(this.accountNo);

    // Setup search filter
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());
  }

  loadPayageData(accountNo: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.payageService.getPayageData(accountNo).subscribe(
      (data) => {
        this.payageData = data.map((item: any) => ({
          ...item,
          Payage: this.calculatePayage(item.Bldat)
        }));
        this.filteredData = [...this.payageData];
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load payage data. Please try again later.';
        this.isLoading = false;
        console.error('Error loading payage data:', error);
      }
    );
  }

  calculatePayage(bldat: string): number {
    if (!bldat) return 0;
    
    const dateStr = bldat.match(/\/Date\((\d+)\)\//);
    if (!dateStr) return 0;
    
    const documentDate = new Date(parseInt(dateStr[1]));
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - documentDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const dateStr = dateString.match(/\/Date\((\d+)\)\//);
    if (!dateStr) return dateString;
    
    const date = new Date(parseInt(dateStr[1]));
    return this.datePipe.transform(date, 'dd-MMM-yyyy') || '';
  }

  applyFilters(): void {
    let filtered = [...this.payageData];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.Belnr.toLowerCase().includes(searchTerm) ||
        item.Bukrs.toLowerCase().includes(searchTerm) ||
        item.Lifnr.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date range filter
    if (this.dateRange.start || this.dateRange.end) {
      filtered = filtered.filter(item => {
        const dateStr = item.Budat.match(/\/Date\((\d+)\)\//);
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
    this.filteredData = [...this.payageData];
  }

  showDetails(item: any): void {
    this.selectedItem = item;
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }
}