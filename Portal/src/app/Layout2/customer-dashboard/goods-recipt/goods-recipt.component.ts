import { CommonModule, DatePipe } from '@angular/common';
import { Component,HostListener,OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoodsReceiptService } from './goods-receipt.service';
import { CustidVendService } from '../../../custid-vend.service';

@Component({
  selector: 'app-goods-recipt',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  template: `
<!-- goodsreceipt.component.html -->
<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6 text-gray-800">Goods Receipts</h1>
  
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
          placeholder="Document or PO number..."
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
    <div class="mt-4 flex justify-end">
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
    <p class="mt-2 text-gray-600">Loading goods receipts...</p>
  </div>
  
  <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {{ errorMessage }}
  </div>
      <div class="text-sm text-gray-600 mb-4 py-4">
    Showing {{ filteredGoodsReceipts.length }} of {{ goodsReceipts.length }} Goods Receipt
  </div>
  
  <!-- Results Table -->
  <div *ngIf="!isLoading && !errorMessage" class="custom-scroll-container">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table header remains the same -->
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let receipt of filteredGoodsReceipts" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ receipt.Mblnr }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ receipt.Ebeln }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(receipt.Budat) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ receipt.Matnr }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ receipt.Menge }} {{ receipt.Meins }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button 
                  (click)="openModal(receipt)"
                  class="text-indigo-600 hover:text-indigo-900 font-medium cursor-pointer"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="filteredGoodsReceipts.length === 0" class="text-center py-8 text-gray-500">
        No goods receipts found matching your criteria.
      </div>
    </div>
  </div>
  
  <!-- Goods Receipt Detail Modal -->
  <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 custom-modal-scroll">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start">
          <h2 class="text-2xl font-bold text-gray-800">Goods Receipt Details</h2>
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
                <p><span class="text-gray-600 font-medium">Document Number:</span> {{ selectedReceipt.Mblnr }}</p>
                <p><span class="text-gray-600 font-medium">Fiscal Year:</span> {{ selectedReceipt.Mjahr }}</p>
                <p><span class="text-gray-600 font-medium">Document Type:</span> {{ selectedReceipt.Blart }}</p>
                <p><span class="text-gray-600 font-medium">Posting Date:</span> {{ formatDate(selectedReceipt.Budat) }}</p>
                <p><span class="text-gray-600 font-medium">Document Date:</span> {{ formatDate(selectedReceipt.Bldat) }}</p>
                <p><span class="text-gray-600 font-medium">Created By:</span> {{ selectedReceipt.Usnam }}</p>
                <p><span class="text-gray-600 font-medium">Movement Type:</span> {{ selectedReceipt.Bwart }}</p>
              </div>
            </div>
            
            <!-- Right Column -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Item Details</h3>
              <div class="space-y-3">
                <p><span class="text-gray-600 font-medium">PO Number:</span> {{ selectedReceipt.Ebeln }}</p>
                <p><span class="text-gray-600 font-medium">PO Item:</span> {{ selectedReceipt.Ebelp }}</p>
                <p><span class="text-gray-600 font-medium">Material:</span> {{ selectedReceipt.Matnr }}</p>
                <p><span class="text-gray-600 font-medium">Quantity:</span> {{ selectedReceipt.Menge }} {{ selectedReceipt.Meins }}</p>
                <p><span class="text-gray-600 font-medium">Plant:</span> {{ selectedReceipt.Werks }}</p>
                <p><span class="text-gray-600 font-medium">Storage Location:</span> {{ selectedReceipt.Lgort }}</p>
                <p><span class="text-gray-600 font-medium">Vendor:</span> {{ selectedReceipt.Lifnr }}</p>
              </div>
            </div>
          </div>
          
          <!-- <div class="mt-6 pt-4 border-t flex justify-end">
            <button 
              (click)="closeModal()"
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
`,
  providers:[DatePipe]
})
export class GoodsReciptComponent implements OnInit {
  goodsReceipts: any[] = [];
  filteredGoodsReceipts: any[] = [];
  isLoading = false;
  errorMessage = '';
  accountNo = '';

  // Filter controls
  searchControl = new FormControl('');
  dateFromControl = new FormControl('');
  dateToControl = new FormControl('');
  materialControl = new FormControl('');

  // Modal state
  showModal = false;
  selectedReceipt: any = null;

  constructor(
    private goodsReceiptService: GoodsReceiptService,
    private datePipe: DatePipe,
    private custid:CustidVendService
  ) { }

  ngOnInit(): void {
    this.accountNo=this.custid.getCustomerId()
    for(let i=0;i<4;i++){
      this.accountNo='0'+this.accountNo
    }
    this.loadGoodsReceipts();
    this.setupFilterListeners();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.showModal) {
      this.closeModal();
    }
  }

  loadGoodsReceipts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.goodsReceiptService.getGoodsReceipts(this.accountNo).subscribe({
      next: (data) => {
        this.goodsReceipts = data;
        this.filteredGoodsReceipts = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load goods receipts. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  setupFilterListeners(): void {
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.dateFromControl.valueChanges.subscribe(() => this.applyFilters());
    this.dateToControl.valueChanges.subscribe(() => this.applyFilters());
    this.materialControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    let filtered = [...this.goodsReceipts];
    
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.Mblnr.toLowerCase().includes(searchTerm) ||
        item.Ebeln.toLowerCase().includes(searchTerm) ||
        item.Matnr.toLowerCase().includes(searchTerm)
      );
    }
    
    const dateFrom = this.dateFromControl.value;
    const dateTo = this.dateToControl.value;
    if (dateFrom || dateTo) {
      filtered = filtered.filter(item => {
        const budat = new Date(parseInt(item.Budat.replace(/\/Date\((\d+)\)\//, '$1')));
        
        if (dateFrom && dateTo) {
          return budat >= new Date(dateFrom) && budat <= new Date(dateTo);
        } else if (dateFrom) {
          return budat >= new Date(dateFrom);
        } else {
          return budat <= new Date(dateTo || "");
        }
      });
    }
    
    const materialFilter = this.materialControl.value;
    if (materialFilter) {
      filtered = filtered.filter(item => 
        item.Matnr.toLowerCase().includes(materialFilter.toLowerCase())
      );
    }
    
    this.filteredGoodsReceipts = filtered;
  }

  openModal(receipt: any): void {
    this.selectedReceipt = receipt;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReceipt = null;
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  formatDate(dateString: string): string {
    const date = new Date(parseInt(dateString.replace(/\/Date\((\d+)\)\//, '$1')));
    return this.datePipe.transform(date, 'mediumDate') || '';
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.dateFromControl.setValue('');
    this.dateToControl.setValue('');
    this.materialControl.setValue('');
    this.applyFilters();
  }
}