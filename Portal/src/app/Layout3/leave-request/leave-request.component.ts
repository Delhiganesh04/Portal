import { Component, OnInit } from '@angular/core';
import { LeaveRequestService } from './leave-request.service';
import { LeaveRequest } from './leave-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Custid3Service } from '../../custid3.service';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Leave Requests</h1>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilters()"
            placeholder="Search..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
        
        <!-- Leave Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
          <select 
            [(ngModel)]="selectedType"
            (ngModelChange)="applyFilters()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option *ngFor="let type of leaveTypes" [value]="type.value">{{type.label}}</option>
          </select>
        </div>
        
        <!-- Date Range Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input 
            type="date" 
            [(ngModel)]="dateRange.start"
            (ngModelChange)="applyFilters()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input 
            type="date" 
            [(ngModel)]="dateRange.end"
            (ngModelChange)="applyFilters()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
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
      Showing {{ filteredLeaves.length }} of {{ leaveRequests.length }} leave requests
    </div>

    <!-- Loading State -->
    <div *ngIf="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Leaves Table -->
    <div *ngIf="!isLoading && !error" class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let leave of filteredLeaves" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getLeaveTypeLabel(leave.Subty) }}</div>
                <!-- <div class="text-sm text-gray-500">{{ leave.Ktart }}</div> -->
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ leave.Pernr }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(leave.Begda) }} - {{ formatDate(leave.Endda) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      [ngClass]="getStatusBadgeClass(leave.Subty)">
                  {{ formatint(leave.Abwtg) }} days
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(leave.Aedtm) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Approved
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="javascript:void(0)" 
                   (click)="openLeaveDetails(leave)"
                   class="text-blue-600 hover:text-blue-900">Details</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No Results Message -->
    <div *ngIf="!isLoading && !error && filteredLeaves.length === 0" class="text-center py-12">
      <p class="text-gray-500">No leave requests match your filter criteria</p>
      <button 
        (click)="resetFilters()"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

    <!-- Modal for Detailed View -->
    <div *ngIf="selectedLeave" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-800">Leave Request Details</h2>
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
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Basic Information</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Employee ID:</span>
                    <span class="font-medium">{{ selectedLeave.Pernr }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Leave Type:</span>
                    <span class="font-medium">{{ getLeaveTypeLabel(selectedLeave.Subty) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Request Date:</span>
                    <span class="font-medium">{{ formatDate(selectedLeave.Aedtm) }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Leave Period</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Start Date:</span>
                    <span class="font-medium">{{ formatDate(selectedLeave.Begda) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">End Date:</span>
                    <span class="font-medium">{{ formatDate(selectedLeave.Endda) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Duration:</span>
                    <span class="font-medium">{{ selectedLeave.Abwtg }} days</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Absence Details</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Absence Type:</span>
                    <span class="font-medium">{{ selectedLeave.Ktart }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Hours:</span>
                    <span class="font-medium">{{ selectedLeave.Anzhl }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Additional Information</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Destination Start:</span>
                    <span class="font-medium">{{ formatDate(selectedLeave.Desta) || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Destination End:</span>
                    <span class="font-medium">{{ formatDate(selectedLeave.Deend) || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Remarks:</span>
                    <span class="font-medium">{{ selectedLeave.Umsch || 'None' }}</span>
                  </div>
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

    /* Status badges */
    .bg-blue-100 {
      background-color: #dbeafe;
    }
    .text-blue-800 {
      color: #1e40af;
    }
    .bg-yellow-100 {
      background-color: #fef3c7;
    }
    .text-yellow-800 {
      color: #92400e;
    }
    .bg-purple-100 {
      background-color: #f3e8ff;
    }
    .text-purple-800 {
      color: #5b21b6;
    }
    .bg-green-100 {
      background-color: #d1fae5;
    }
    .text-green-800 {
      color: #065f46;
    }
    .bg-gray-100 {
      background-color: #f3f4f6;
    }
    .text-gray-800 {
      color: #1f2937;
    }
  `]
})
export class LeaveRequestComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  filteredLeaves: LeaveRequest[] = [];
  selectedLeave: LeaveRequest | null = null;
  isLoading = false;
  error: string | null = null;
  id=''

  // Filter options
  searchTerm = '';
  leaveTypes: {value: string, label: string}[] = [
    {value: '0300', label: 'Annual Leave'},
    {value: '0720', label: 'Sick Leave'},
    {value: '1000', label: 'Maternity Leave'},
    {value: '2000', label: 'Paternity Leave'},
    {value: '3000', label: 'Unpaid Leave'},
    { value: '0220', label: 'Compensatory Off' },
    { value: '0700', label: 'Casual Leave' }
  ];
  selectedType = '';
  dateRange = {
    start: '',
    end: ''
  };

  constructor(private leaveService: LeaveRequestService,
              private custid: Custid3Service
  ) { }

  ngOnInit(): void {
    this.id = this.custid.getCustomerId()
    this.loadLeaveRequests(this.id); // Replace with actual employee ID
  }

  loadLeaveRequests(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.leaveService.getLeaveRequests(id).subscribe({
      next: (response) => {
        this.leaveRequests = response.leaves;
        this.filteredLeaves = [...this.leaveRequests];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load leave requests. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  openLeaveDetails(leave: LeaveRequest): void {
    this.selectedLeave = leave;
  }

  closeModal(): void {
    this.selectedLeave = null;
  }

  formatint(num:string){
    return Number(num)
  }

  applyFilters(): void {
    this.filteredLeaves = this.leaveRequests.filter(leave => {
      // Filter by search term
      if (this.searchTerm && 
          !this.getLeaveTypeLabel(leave.Subty).toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          !leave.Pernr.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by leave type
      if (this.selectedType && leave.Subty !== this.selectedType) {
        return false;
      }
      
      // Filter by date range
      if (this.dateRange.start && new Date(leave.Begda) < new Date(this.dateRange.start)) {
        return false;
      }
      
      if (this.dateRange.end && new Date(leave.Endda) > new Date(this.dateRange.end)) {
        return false;
      }
      
      return true;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.dateRange = { start: '', end: '' };
    this.filteredLeaves = [...this.leaveRequests];
  }

  getLeaveTypeLabel(subty: string): string {
    const type = this.leaveTypes.find(t => t.value === subty);
    return type ? type.label : subty;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case '0300': return 'bg-blue-100 text-blue-800';
      case '0720': return 'bg-yellow-100 text-yellow-800';
      case '1000': return 'bg-purple-100 text-purple-800';
      case '2000': return 'bg-green-100 text-green-800';
      case '3000': return 'bg-gray-100 text-gray-800';
      case '0220': return 'bg-blue-100 text-blue-800';
      case '0700': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}