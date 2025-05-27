// import { Component ,OnInit} from '@angular/core';
// import { SalesData ,DateRange} from './sales-data';
// import { SalesDataService } from './sales-data.service';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { SalesFilters } from './sales-data';
// import { CustidService } from '../../../custid.service';

// // Define the SalesFilters interface


// @Component({
//   selector: 'app-overall-salesdata',
//   imports: [CommonModule,FormsModule],
//   providers: [DatePipe],
//   template: `
//   <div class="min-h-screen bg-gray-50 p-4 md:p-8">
//   <div class="max-w-7xl mx-auto">
//     <!-- Header -->
//     <div class="mb-8">
//       <h1 class="text-3xl font-bold text-gray-800">Overall Sales Dashboard</h1>
//       <p class="text-gray-600">Customer ID: {{customerId}}</p>
//     </div>

//     <!-- Filters -->
//     <div class="bg-white rounded-lg shadow p-6 mb-8">
//       <h2 class="text-xl font-semibold mb-4 text-gray-700">Filters</h2>
      
//       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <!-- Date Range -->
//         <!-- <div> -->
//           <div class="md:col-span-2">

//           <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//           <!-- <div class="flex space-x-2"> -->
//             <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">

//             <input type="date" class="w-full p-2 border rounded-md" 
//                    [value]="filters.dateRange?.start ? (filters.dateRange?.start | date:'yyyy-MM-dd') : ''"
//                    (change)="onStartDateChange($event)">
//             <input type="date" class="w-full p-2 border rounded-md"
//                    [value]="filters.dateRange?.end ? (filters.dateRange?.end | date:'yyyy-MM-dd') : ''"
//                    (change)="onEndDateChange($event)">
//           </div>
//         </div>

//         <!-- Product Filter -->
//         <div>
//           <label class="block text-sm font-medium text-gray-700 mb-1">Product</label>
//           <input type="text" class="w-full p-2 border rounded-md" placeholder="Search products..."
//                  [(ngModel)]="filters.product" (input)="applyFilters()">
//         </div>

//         <!-- Sales Org Filter -->
//         <div>
//           <label class="block text-sm font-medium text-gray-700 mb-1">Sales Org</label>
//           <select class="w-full p-2 border rounded-md" [(ngModel)]="filters.salesOrg" (change)="applyFilters()">
//             <option value="">All</option>
//             <option *ngFor="let org of getUniqueSalesOrgs()" [value]="org">{{org}}</option>
//           </select>
//         </div>

//         <!-- Amount Range -->
//         <div>
//           <label class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
//           <div class="flex space-x-2">
//             <input type="number" class="w-full p-2 border rounded-md" placeholder="Min"
//                    [(ngModel)]="filters.minAmount" (input)="applyFilters()">
//             <input type="number" class="w-full p-2 border rounded-md" placeholder="Max"
//                    [(ngModel)]="filters.maxAmount" (input)="applyFilters()">
//           </div>
//         </div>
//       </div>

//       <div class="mt-4 flex justify-end">
//         <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
//                 (click)="resetFilters()">
//           Reset Filters
//         </button>
//       </div>
//     </div>

//     <!-- Loading State -->
//     <div *ngIf="loading" class="text-center py-12">
//       <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       <p class="mt-4 text-gray-600">Loading sales data...</p>
//     </div>

//     <!-- Error State -->
//     <div *ngIf="error && !loading" class="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
//       <div class="flex">
//         <div class="flex-shrink-0">
//           <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//             <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
//           </svg>
//         </div>
//         <div class="ml-3">
//           <p class="text-sm text-red-700">{{error}}</p>
//         </div>
//       </div>
//     </div>

//     <!-- Metrics -->
//     <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//       <div class="bg-white rounded-lg shadow p-6">
//         <h3 class="text-lg font-medium text-gray-500">Total Sales</h3>
//         <p class="mt-2 text-3xl font-semibold text-blue-600">{{totalSales | currency:'INR':'symbol':'1.2-2'}}</p>
//       </div>
      
//       <div class="bg-white rounded-lg shadow p-6">
//         <h3 class="text-lg font-medium text-gray-500">Total Quantity</h3>
//         <p class="mt-2 text-3xl font-semibold text-green-600">{{totalQuantity}}</p>
//       </div>
      
//       <div class="bg-white rounded-lg shadow p-6">
//         <h3 class="text-lg font-medium text-gray-500">Unique Products</h3>
//         <p class="mt-2 text-3xl font-semibold text-purple-600">{{uniqueProducts}}</p>
//       </div>
//     </div>

//     <!-- Charts -->
//     <div *ngIf="!loading && !error" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//       <!-- Sales by Product -->
//       <div class="bg-white rounded-lg shadow p-6">
//         <h3 class="text-lg font-medium text-gray-700 mb-4">Sales by Product</h3>
//         <div class="h-64">
//           <div class="space-y-2">
//             <div *ngFor="let item of salesByProduct" class="flex items-center">
//               <div class="w-1/4 text-sm text-gray-600 truncate">{{item.product}}</div>
//               <div class="w-3/4">
//                 <div class="bg-blue-100 h-6 rounded-full">
//                   <div class="bg-blue-500 h-6 rounded-full" 
//                        [style.width]="(item.total / totalSales * 100) + '%'">
//                     <span class="text-xs text-white pl-2">{{(item.total / totalSales * 100).toFixed(1)}}%</span>
//                   </div>
//                 </div>
//               </div>
//               <div class="w-1/4 text-right text-sm font-medium">
//                 {{item.total | currency:'INR':'symbol':'1.2-2'}}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <!-- Sales Over Time -->
//       <div class="bg-white rounded-lg shadow p-6">
//         <h3 class="text-lg font-medium text-gray-700 mb-4">Sales Over Time</h3>
//         <div class="h-64">
//           <div class="flex h-full items-end space-x-2">
//             <div *ngFor="let item of salesOverTime" class="flex-1 flex flex-col items-center">
//               <div class="bg-green-500 w-full rounded-t-sm" 
//                    [style.height]="(item.total / getMaxSales() * 100) + '%'">
//               </div>
//               <div class="text-xs text-gray-500 mt-1">{{item.date}}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     <!-- Data Table -->
//     <div *ngIf="!loading && !error" class="bg-white rounded-lg shadow overflow-hidden">
//       <div class="px-6 py-4 border-b">
//         <h3 class="text-lg font-medium text-gray-700">Sales Details</h3>
//         <p class="text-sm text-gray-500">{{filteredData.length}} records found</p>
//       </div>
      
//       <div class="overflow-x-auto">
//         <table class="min-w-full divide-y divide-gray-200">
//           <thead class="bg-gray-50">
//             <tr>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
//             </tr>
//           </thead>
//           <tbody class="bg-white divide-y divide-gray-200">
//             <tr *ngFor="let item of filteredData" class="hover:bg-gray-50">
//               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{item.Vbeln}}</td>
//               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{item.Audat | date:'mediumDate'}}</td>
//               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{item.Arktx}}</td>
//               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{item.Kwmeng}} {{item.Vrkme}}</td>
//               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{{item.Netwr | currency:'INR':'symbol':'1.2-2'}}</td>
//               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{item.Bstnk || 'N/A'}}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
      
//       <div *ngIf="filteredData.length === 0" class="p-6 text-center text-gray-500">
//         No sales records match your filters.
//       </div>
//     </div>
//   </div>
// </div>
//   `,
//   styles: ``
// })
// export class OverallSalesdataComponent implements OnInit {
//   salesData: SalesData[] = [];
//   filteredData: SalesData[] = [];
//   loading = false;
//   error: string | null = null;
//   filters: SalesFilters = {};
//   totalSales = 0;
//   totalQuantity = 0;
//   uniqueProducts = 0;
//  ; // Default customer ID

//   // For charts
//   salesByProduct: { product: string; total: number }[] = [];
//   salesOverTime: { date: string; total: number }[] = [];

//   customerId: string = '';

//   constructor(
//     private salesDataService: SalesDataService,
//     private datePipe: DatePipe,
//     private custid: CustidService
//   ) { }

//   ngOnInit(): void {
//     this.customerId = this.custid.getCustomerId();
//     this.fetchSalesData();
//   }

//   fetchSalesData(): void {
//     this.loading = true;
//     this.error = null;
    
//     this.salesDataService.getOverallSales(this.customerId).subscribe({
//       next: (data) => {
//         this.salesData = data;
//         this.applyFilters();
//         this.calculateMetrics();
//         this.prepareChartData();
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load sales data. Please try again later.';
//         this.loading = false;
//         console.error(err);
//       }
//     });
//   }

//   applyFilters(): void {
//     this.filteredData = [...this.salesData];

//     if (this.filters.dateRange?.start && this.filters.dateRange?.end) {
//       this.filteredData = this.filteredData.filter(item => {
//         const saleDate = new Date(item.Audat);
//         return saleDate >= this.filters.dateRange!.start! && 
//                saleDate <= this.filters.dateRange!.end!;
//       });
//     }

//     if (this.filters.product) {
//       this.filteredData = this.filteredData.filter(item => 
//         item.Arktx.toLowerCase().includes(this.filters.product!.toLowerCase())
//       );
//     }

//     if (this.filters.salesOrg) {
//       this.filteredData = this.filteredData.filter(item => 
//         item.Vkorg === this.filters.salesOrg
//       );
//     }

//     if (this.filters.minAmount) {
//       this.filteredData = this.filteredData.filter(item => 
//         parseFloat(item.Netwr) >= this.filters.minAmount!
//       );
//     }

//     if (this.filters.maxAmount) {
//       this.filteredData = this.filteredData.filter(item => 
//         parseFloat(item.Netwr) <= this.filters.maxAmount!
//       );
//     }

//     this.calculateMetrics();
//     this.prepareChartData();
//   }

//   calculateMetrics(): void {
//     this.totalSales = this.filteredData.reduce((sum, item) => sum + parseFloat(item.Netwr), 0);
//     this.totalQuantity = this.filteredData.reduce((sum, item) => sum + parseFloat(item.Kwmeng), 0);
    
//     const uniqueProducts = new Set(this.filteredData.map(item => item.Matnr));
//     this.uniqueProducts = uniqueProducts.size;
//   }

//   prepareChartData(): void {
//     // Sales by product
//     const productMap = new Map<string, number>();
//     this.filteredData.forEach(item => {
//       const current = productMap.get(item.Arktx) || 0;
//       productMap.set(item.Arktx, current + parseFloat(item.Netwr));
//     });
//     this.salesByProduct = Array.from(productMap.entries()).map(([product, total]) => ({ product, total }));

//     // Sales over time
//     const dateMap = new Map<string, number>();
//     this.filteredData.forEach(item => {
//       const formattedDate = this.datePipe.transform(item.Audat, 'shortDate') || item.Audat;
//       const current = dateMap.get(formattedDate) || 0;
//       dateMap.set(formattedDate, current + parseFloat(item.Netwr));
//     });
//     this.salesOverTime = Array.from(dateMap.entries()).map(([date, total]) => ({ date, total }));
//   }

//   onStartDateChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     this.filters.dateRange = this.filters.dateRange || { start: null, end: null };
//     this.filters.dateRange.start = input.valueAsDate;
//     this.applyFilters();
//   }

//   onEndDateChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     this.filters.dateRange = this.filters.dateRange || { start: null, end: null };
//     this.filters.dateRange.end = input.valueAsDate;
//     this.applyFilters();
//   }

//   getUniqueSalesOrgs(): string[] {
//     const orgs = new Set(this.salesData.map(item => item.Vkorg));
//     return Array.from(orgs);
//   }

//   getMaxSales(): number {
//     if (this.salesOverTime.length === 0) return 0;
//     return Math.max(...this.salesOverTime.map(item => item.total));
//   }

//   resetFilters(): void {
//     this.filters = {};
//     this.applyFilters();
//   }
// }

// -------------------------------------------------------------------------------------


import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesDataService } from './sales-data.service';
import { CustidService } from '../../../custid.service';
import { ScaleType } from '@swimlane/ngx-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';


interface SalesData {
  Vbeln: string;
  Audat: string;
  Arktx: string;
  Kwmeng: string;
  Vrkme: string;
  Netwr: string;
  Bstnk?: string;
  Vkorg: string;
  Matnr: string;
}

interface SalesFilters {
  dateRange?: { start: Date | null; end: Date | null };
  product?: string;
  salesOrg?: string;
  minAmount?: number;
  maxAmount?: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  providers: [DatePipe],
  template: `
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Overall Sales Dashboard</h1>
      <p class="text-gray-600">Customer ID: {{customerId}}</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Filters</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Date Range -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <input type="date" class="w-full p-2 border rounded-md" 
                   [value]="filters.dateRange?.start ? (filters.dateRange?.start | date:'yyyy-MM-dd') : ''"
                   (change)="onStartDateChange($event)">
            <input type="date" class="w-full p-2 border rounded-md"
                   [value]="filters.dateRange?.end ? (filters.dateRange?.end | date:'yyyy-MM-dd') : ''"
                   (change)="onEndDateChange($event)">
          </div>
        </div>

        <!-- Product Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Search products..."
                 [(ngModel)]="filters.product" (input)="applyFilters()">
        </div>

        <!-- Sales Org Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sales Org</label>
          <select class="w-full p-2 border rounded-md" [(ngModel)]="filters.salesOrg" (change)="applyFilters()">
            <option value="">All</option>
            <option *ngFor="let org of getUniqueSalesOrgs()" [value]="org">{{org}}</option>
          </select>
        </div>

        <!-- Amount Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
          <div class="flex space-x-2">
            <input type="number" class="w-full p-2 border rounded-md" placeholder="Min"
                   [(ngModel)]="filters.minAmount" (input)="applyFilters()">
            <input type="number" class="w-full p-2 border rounded-md" placeholder="Max"
                   [(ngModel)]="filters.maxAmount" (input)="applyFilters()">
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                (click)="resetFilters()">
          Reset Filters
        </button>
      </div>
    </div>
    

    <!-- Loading State -->
    <div *ngIf="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-4 text-gray-600">Loading sales data...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="error && !loading" class="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{error}}</p>
        </div>
      </div>
    </div>

    <!-- Metrics -->
    <div *ngIf="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-500">Total Sales</h3>
        <p class="mt-2 text-3xl font-semibold text-blue-600">{{totalSales | currency:'INR':'symbol':'1.2-2'}}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-500">Total Quantity</h3>
        <p class="mt-2 text-3xl font-semibold text-green-600">{{totalQuantity}}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-500">Unique Products</h3>
        <p class="mt-2 text-3xl font-semibold text-purple-600">{{uniqueProducts}}</p>
      </div>
    </div>

    <!-- Charts -->
    <div *ngIf="!loading && !error" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Sales by Product -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-700 mb-4">Sales by Product</h3>
        <div class="h-64">
          <div class="space-y-2">
            <div *ngFor="let item of salesByProduct" class="flex items-center">
              <div class="w-1/4 text-sm text-gray-600 truncate">{{item.product}}</div>
              <div class="w-3/4">
                <div class="bg-blue-100 h-6 rounded-full">
                  <div class="bg-blue-500 h-6 rounded-full" 
                       [style.width]="(item.total / totalSales * 100) + '%'">
                    <span class="text-xs text-white pl-2">{{(item.total / totalSales * 100).toFixed(1)}}%</span>
                  </div>
                </div>
              </div>
              <div class="w-1/4 text-right text-sm font-medium">
                {{item.total | currency:'INR':'symbol':'1.2-2'}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Over Time -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-700 mb-4">Sales Over Time</h3>
        <div class="h-64">
          <ngx-charts-bar-vertical
            *ngIf="salesOverTimeChart.length > 0"
            [results]="salesOverTimeChart"
            [xAxis]="showXAxis"
            [yAxis]="showYAxis"
            [gradient]="gradient"
            [showXAxisLabel]="showXAxisLabel"
            [showYAxisLabel]="showYAxisLabel"
            [xAxisLabel]="xAxisLabel"
            [yAxisLabel]="yAxisLabel"
            >
          </ngx-charts-bar-vertical>
          <div *ngIf="salesOverTimeChart.length === 0" class="h-full flex items-center justify-center text-gray-400">
            No sales data available for the selected period
          </div>
        </div>
      </div>
    </div>
       <!-- Results Count -->
  <div class="text-sm text-gray-600 mb-4 py-4">
    Showing {{ filteredData.length }} of {{ salesData.length }} Sales Data
  </div>
    <!-- Data Table -->
    <div *ngIf="!loading && !error" class="bg-white rounded-lg shadow overflow-hidden custom-scroll-container">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium text-gray-700">Sales Details</h3>
        <p class="text-sm text-gray-500">{{filteredData.length}} records found</p>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let item of filteredData" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{item.Vbeln}}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{item.Audat | date:'mediumDate'}}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{item.Arktx}}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{item.Kwmeng}} {{item.Vrkme}}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{{item.Netwr | currency:'INR':'symbol':'1.2-2'}}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{item.Bstnk || 'N/A'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="filteredData.length === 0" class="p-6 text-center text-gray-500">
        No sales records match your filters.
      </div>
    </div>

  
  </div>
</div>
  `,
  styles:`
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
export class OverallSalesdataComponent implements OnInit {
  salesData: SalesData[] = [];
  filteredData: SalesData[] = [];
  loading = false;
  error: string | null = null;
  filters: SalesFilters = {};
  totalSales = 0;
  totalQuantity = 0;
  uniqueProducts = 0;
  customerId: string = '';

  // Chart data
  salesByProduct: { product: string; total: number }[] = [];
  salesOverTimeChart: any[] = [];
  
  // NGX-Charts Configuration
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Sales Amount';
  colorScheme = {
    domain: ['#3B82F6'],
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal
  };

  constructor(
    private salesDataService: SalesDataService,
    private datePipe: DatePipe,
    private custid: CustidService
  ) { }

  ngOnInit(): void {
    this.customerId = this.custid.getCustomerId();
    this.fetchSalesData();
  }

  fetchSalesData(): void {
    this.loading = true;
    this.error = null;
    
    this.salesDataService.getOverallSales(this.customerId).subscribe({
      next: (data) => {
        this.salesData = data;
        this.applyFilters();
        this.calculateMetrics();
        this.prepareChartData();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sales data. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.filteredData = [...this.salesData];

    if (this.filters.dateRange?.start && this.filters.dateRange?.end) {
      this.filteredData = this.filteredData.filter(item => {
        const saleDate = new Date(item.Audat);
        return saleDate >= this.filters.dateRange!.start! && 
               saleDate <= this.filters.dateRange!.end!;
      });
    }

    if (this.filters.product) {
      this.filteredData = this.filteredData.filter(item => 
        item.Arktx.toLowerCase().includes(this.filters.product!.toLowerCase())
      );
    }

    if (this.filters.salesOrg) {
      this.filteredData = this.filteredData.filter(item => 
        item.Vkorg === this.filters.salesOrg
      );
    }

    if (this.filters.minAmount) {
      this.filteredData = this.filteredData.filter(item => 
        parseFloat(item.Netwr) >= this.filters.minAmount!
      );
    }

    if (this.filters.maxAmount) {
      this.filteredData = this.filteredData.filter(item => 
        parseFloat(item.Netwr) <= this.filters.maxAmount!
      );
    }

    this.calculateMetrics();
    this.prepareChartData();
  }

  calculateMetrics(): void {
    this.totalSales = this.filteredData.reduce((sum, item) => sum + parseFloat(item.Netwr), 0);
    this.totalQuantity = this.filteredData.reduce((sum, item) => sum + parseFloat(item.Kwmeng), 0);
    
    const uniqueProducts = new Set(this.filteredData.map(item => item.Matnr));
    this.uniqueProducts = uniqueProducts.size;
  }

  prepareChartData(): void {
    // Sales by product
    const productMap = new Map<string, number>();
    this.filteredData.forEach(item => {
      const current = productMap.get(item.Arktx) || 0;
      productMap.set(item.Arktx, current + parseFloat(item.Netwr));
    });
    this.salesByProduct = Array.from(productMap.entries())
      .map(([product, total]) => ({ product, total }))
      .sort((a, b) => b.total - a.total);

    // Sales over time - for ngx-charts
    const dateMap = new Map<string, number>();
    this.filteredData.forEach(item => {
      const formattedDate = this.datePipe.transform(item.Audat, 'mediumDate') || item.Audat;
      const current = dateMap.get(formattedDate) || 0;
      dateMap.set(formattedDate, current + parseFloat(item.Netwr));
    });
    
    this.salesOverTimeChart = Array.from(dateMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.dateRange = this.filters.dateRange || { start: null, end: null };
    this.filters.dateRange.start = input.valueAsDate;
    this.applyFilters();
  }

  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.dateRange = this.filters.dateRange || { start: null, end: null };
    this.filters.dateRange.end = input.valueAsDate;
    this.applyFilters();
  }

  getUniqueSalesOrgs(): string[] {
    const orgs = new Set(this.salesData.map(item => item.Vkorg));
    return Array.from(orgs);
  }

  resetFilters(): void {
    this.filters = {};
    this.applyFilters();
  }
}
