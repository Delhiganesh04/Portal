import { Component, OnInit } from '@angular/core';
import { PayslipService, Payslip } from './payslip.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Custid3Service } from '../../custid3.service';

@Component({
  selector: 'app-pay-slip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Employee Payslips</h1>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilters()"
            placeholder="Search by ID, name, company..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
        
        <!-- Company Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <select 
            [(ngModel)]="selectedCompany"
            (ngModelChange)="applyFilters()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Companies</option>
            <option *ngFor="let company of companies" [value]="company">{{company}}</option>
          </select>
        </div>
        
        <!-- Salary Group Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Salary Group</label>
          <select 
            [(ngModel)]="selectedSalaryGroup"
            (ngModelChange)="applyFilters()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Groups</option>
            <option *ngFor="let group of salaryGroups" [value]="group">{{group}}</option>
          </select>
        </div>
      </div>
      
      <div class="mt-3 flex justify-end">
        <button 
          (click)="resetFilters()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2 cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <div class="text-sm text-gray-600 mb-4">
      Showing {{ filteredPayslips.length }} of {{ payslips.length }} payslips
    </div>

    <!-- Loading State -->
    <div *ngIf="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Payslips Table -->
    <div *ngIf="!isLoading && !error" class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Center</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let payslip of filteredPayslips" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ payslip.Pernr }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payslip.Vorna }}</div>
                <div class="text-xs text-gray-500">{{ getGenderLabel(payslip.Gesch) }} | {{ formatDate(payslip.Gbdat) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payslip.Bukrs }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payslip.Kostl }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payslip.Bet01 }} {{ payslip.Waers }}</div>
                <div class="text-xs text-gray-500">Group: {{ payslip.Trfgr }} | Level: {{ payslip.Trfst }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="javascript:void(0)" 
                   (click)="openPayslipDetails(payslip)"
                   class="text-blue-600 hover:text-blue-900">Details</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No Results Message -->
    <div *ngIf="!isLoading && !error && filteredPayslips.length === 0" class="text-center py-12">
      <p class="text-gray-500">No payslips match your filter criteria</p>
      <button 
        (click)="resetFilters()"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

    <!-- Modal for Detailed View -->
    <div *ngIf="selectedPayslip" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-800">Payslip Details</h2>
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
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Employee Information</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Employee ID:</span>
                    <span class="font-medium">{{ selectedPayslip.Pernr }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Name:</span>
                    <span class="font-medium">{{ selectedPayslip.Vorna }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Gender:</span>
                    <span class="font-medium">{{ getGenderLabel(selectedPayslip.Gesch) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Birth Date:</span>
                    <span class="font-medium">{{ formatDate(selectedPayslip.Gbdat) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Nationality:</span>
                    <span class="font-medium">{{ selectedPayslip.Natio }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Company Information</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Company:</span>
                    <span class="font-medium">{{ selectedPayslip.Bukrs }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Cost Center:</span>
                    <span class="font-medium">{{ selectedPayslip.Kostl }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Position:</span>
                    <span class="font-medium">{{ selectedPayslip.Stell || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Salary Information</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Salary Group:</span>
                    <span class="font-medium">{{ selectedPayslip.Trfgr }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Salary Level:</span>
                    <span class="font-medium">{{ selectedPayslip.Trfst }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Amount:</span>
                    <span class="font-medium">{{ selectedPayslip.Bet01 }} {{ selectedPayslip.Waers }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Wage Type:</span>
                    <span class="font-medium">{{ selectedPayslip.Lga01 }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Additional Information</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Division:</span>
                    <span class="font-medium">{{ selectedPayslip.Divgv }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              (click)="mailPayslip(selectedPayslip)"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              Mail
            </button>
            <button
              (click)="downloadPayslip(selectedPayslip)"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
            >
              Download
            </button>
            <!-- <button
              (click)="closeModal()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              Close
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    /* Custom scrollbar styles */
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

    /* Table styling */
    table {
      min-width: 100%;
    }

    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background-color: #f9fafb;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    tr:hover {
      background-color: #f9fafb;
    }
  `]
})
export class PaySlipComponent implements OnInit {
  payslips: Payslip[] = [];
  filteredPayslips: Payslip[] = [];
  selectedPayslip: Payslip | null = null;
  isLoading = false;
  error: string | null = null;
  id = '';

  // Filter options
  searchTerm = '';
  companies: string[] = [];
  selectedCompany = '';
  salaryGroups: string[] = [];
  selectedSalaryGroup = '';

  constructor(
    private payslipService: PayslipService,
    private custid: Custid3Service
  ) { }

  ngOnInit(): void {
    this.id = this.custid.getCustomerId();
    this.loadPayslips(this.id);
  }

  loadPayslips(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.payslipService.getPayslips(id).subscribe({
      next: (data) => {
        this.payslips = data;
        this.filteredPayslips = [...this.payslips];
        
        // Extract unique companies and salary groups for filters
        this.companies = [...new Set(this.payslips.map(p => p.Bukrs))];
        this.salaryGroups = [...new Set(this.payslips.map(p => p.Trfgr))];
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load payslips. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  openPayslipDetails(payslip: Payslip): void {
    this.selectedPayslip = payslip;
  }

  closeModal(): void {
    this.selectedPayslip = null;
  }

  applyFilters(): void {
    this.filteredPayslips = this.payslips.filter(payslip => {
      // Filter by search term
      if (this.searchTerm && 
          !payslip.Pernr.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          !payslip.Vorna.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by company
      if (this.selectedCompany && payslip.Bukrs !== this.selectedCompany) {
        return false;
      }
      
      // Filter by salary group
      if (this.selectedSalaryGroup && payslip.Trfgr !== this.selectedSalaryGroup) {
        return false;
      }
      
      return true;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCompany = '';
    this.selectedSalaryGroup = '';
    this.filteredPayslips = [...this.payslips];
  }

  getGenderLabel(genderCode: string): string {
    return genderCode === '1' ? 'Male' : 'Female';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

   downloadPayslip(payslip: Payslip): void {
      this.payslipService.downloadPdf(payslip.Pernr).subscribe({
        next: (blob: Blob) => {
          // Create a download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Payslip_${payslip.Pernr}_.pdf`;
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

    mailPayslip(payslip: Payslip): void {
    // const recipient = prompt('Enter recipient email address:', '');
    const recipient="sec21ei029@sairamtap.edu.in"
    if (!recipient) return;

    this.isLoading = true;
    this.payslipService.sendPayslipByEmail(payslip.Pernr, recipient).subscribe({
      next: () => {
        alert('Payslip sent successfully!');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error sending email:', err);
        alert('Failed to send email. Please try again.');
        this.isLoading = false;
      }
    });
  }
}