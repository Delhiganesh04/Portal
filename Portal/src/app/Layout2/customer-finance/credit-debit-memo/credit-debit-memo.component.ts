import { Component, HostListener, OnInit } from '@angular/core';
import { CreditDebitService } from './credit-debit.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule, DatePipe } from '@angular/common';
import { CustidVendService } from '../../../custid-vend.service';

@Component({
  selector: 'app-credit-debit-memo',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  template: `
<!-- goods-receipt.component.html -->
<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Credit/Debit Data</h1>
  
  <!-- Filters Section -->
  <div class="bg-white shadow rounded-lg p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input 
          [formControl]="searchControl"
          type="text" 
          placeholder="Search by document, account..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      
      <!-- SHKZG Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Debit/Credit</label>
        <select 
          [formControl]="shkzgFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">All</option>
          <option value="S">Credit</option>
          <option value="H">Debit</option>
        </select>
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
    Showing {{ filteredData.length }} of {{ creditDebitData.length }} Memo Details
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
              {{ column === 'actions' ? 'Actions' : column }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let item of filteredData" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ item.Belnr }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(item.Budat) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span [ngClass]="{
                'bg-green-100 text-green-800': item.Shkzg === 'S',
                'bg-red-100 text-red-800': item.Shkzg === 'H'
              }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ item.Shkzg === 'S' ? 'Credit' : 'Debit' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Wrbtr }} {{ item.Waers }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Waers }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Hkont }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.Bschl }}
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

<!-- Goods Receipt Detail Modal -->
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
              <p><span class="text-gray-600 font-medium">Created By:</span> {{ selectedItem?.Usnam }}</p>
              <p><span class="text-gray-600 font-medium">Posting Key:</span> {{ selectedItem?.Bschl }}</p>
            </div>
          </div>
          
          <!-- Right Column -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Financial Details</h3>
            <div class="space-y-3">
              <p><span class="text-gray-600 font-medium">Amount:</span> 
                {{ selectedItem?.Wrbtr }} {{ selectedItem?.Waers }}
                <span [ngClass]="{
                  'bg-green-100 text-green-800': selectedItem?.Shkzg === 'S',
                  'bg-red-100 text-red-800': selectedItem?.Shkzg === 'H'
                }" class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ selectedItem?.Shkzg === 'S' ? 'Credit' : 'Debit' }}
                </span>
              </p>
              <p><span class="text-gray-600 font-medium">Account Number:</span> {{ selectedItem?.Hkont }}</p>
              <p><span class="text-gray-600 font-medium">Vendor:</span> {{ selectedItem?.Lifnr }}</p>
              <p><span class="text-gray-600 font-medium">Currency:</span> {{ selectedItem?.Waers }}</p>
              <p><span class="text-gray-600 font-medium">Clearing Document:</span> {{ selectedItem?.Augbl || 'N/A' }}</p>
              <p><span class="text-gray-600 font-medium">Special G/L Indicator:</span> {{ selectedItem?.Umskz || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: `/* goods-receipt.component.css */
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
}

/* Modal animation */
.modal-enter {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 200ms, transform 200ms;
}

.modal-exit {
  opacity: 1;
}

.modal-exit-active {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 200ms, transform 200ms;
}`,
providers:[DatePipe]
})
export class CreditDebitMemoComponent implements OnInit {
  creditDebitData: any[] = [];
  filteredData: any[] = [];
  isLoading = false;
  errorMessage = '';
  accountNumber = '';
  showModal = false;
  selectedItem: any = null;

  // Filter controls
  searchControl = new FormControl('');
  shkzgFilter = new FormControl('all');
  dateRange = {
    start: null,
    end: null
  };

  // Table columns
  displayedColumns = ['DocumentNo', 'Creation Date', 'Memo', 'Amount', 'Currency', 'G/L AccNo', 'Posting key', 'actions'];

  constructor(
    private creditDebitService: CreditDebitService,
    private datePipe: DatePipe,
    private custid: CustidVendService
  ) { }

  ngOnInit(): void {
    this.accountNumber=this.custid.getCustomerId()
    for(let i=0;i<4;i++){
      this.accountNumber='0'+this.accountNumber
    }

    this.loadData();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());

    this.shkzgFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  @HostListener('body:class', ['$event'])
  onModalToggle() {
    if (this.showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.creditDebitService.getCreditDebitData(this.accountNumber).subscribe(
      (data) => {
        this.creditDebitData = data;
        this.filteredData = [...data];
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load credit/debit data';
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  applyFilters(): void {
    let result = [...this.creditDebitData];
    
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      result = result.filter(item => 
        item.Belnr.toLowerCase().includes(searchTerm) ||
        item.Hkont.toLowerCase().includes(searchTerm) ||
        item.Usnam.toLowerCase().includes(searchTerm)
      );
    }

    if (this.shkzgFilter.value !== 'all') {
      result = result.filter(item => item.Shkzg === this.shkzgFilter.value);
    }

    if (this.dateRange.start && this.dateRange.end) {
      result = result.filter(item => {
        const itemDate = new Date(item.Budat);
        const startDate = this.dateRange.start ? new Date(this.dateRange.start) : null;
        const endDate = this.dateRange.end ? new Date(this.dateRange.end) : null;
        return (
          startDate !== null &&
          endDate !== null &&
          itemDate >= startDate &&
          itemDate <= endDate
        );
      });
    }

    this.filteredData = result;
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.shkzgFilter.setValue('all');
    this.dateRange = { start: null, end: null };
    this.applyFilters();
  }

  formatDate(dateString: string): string {
    const date = new Date(parseInt(dateString.replace(/\/Date\((\d+)\)\//, '$1')));
    return this.datePipe.transform(date, 'mediumDate') || '';
  }


  showDetails(item: any): void {
    this.selectedItem = item;
    this.showModal = true;
    this.onModalToggle();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem = null;
    this.onModalToggle();
  }
}

