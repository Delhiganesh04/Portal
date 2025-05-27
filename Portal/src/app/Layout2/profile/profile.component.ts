import { Component, OnInit } from '@angular/core';
import { CommonModule ,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from './profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Customer Profile</h2>
        <!-- <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          (click)="toggleEditMode()"
        >
          {{ editMode ? 'Save Changes' : 'Edit Profile' }}
        </button> -->
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Profile Picture -->
        <div class="flex flex-col items-center">
          <div class="relative mb-4">
            <img 
              [src]="customer.profileImage || 'assets/default-profile.png'" 
              alt="Profile Picture"
              class="w-50 h-50 rounded-full object-cover border-4 border-blue-200"
            >
            <input 
              *ngIf="editMode"
              type="file" 
              id="profileImage"
              class="hidden"
              (change)="onFileSelected($event)"
            >
            <label 
              *ngIf="editMode"
              for="profileImage"
              class="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>
          <h3 class="text-xl font-semibold text-gray-800">{{ customer.name }}</h3>
          <p class="text-gray-600">{{ customer.customerId }}</p>
        </div>

        <!-- Customer Details -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="customer.name"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-3 py-2 text-gray-800">{{ customer.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="customer.email"
                type="email"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-3 py-2 text-gray-800">{{ customer.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="customer.phone"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-3 py-2 text-gray-800">{{ customer.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <p class="px-3 py-2 text-gray-800">{{ customer.customerId }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              *ngIf="editMode"
              [(ngModel)]="customer.address"
              rows="3"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <p *ngIf="!editMode" class="px-3 py-2 text-gray-800 whitespace-pre-line">{{ customer.address }}</p>
          </div>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="mt-8 border-t pt-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Membership</h4>
            <p class="text-blue-600 font-semibold">{{ customer.membershipType }}</p>
            <p class="text-sm text-gray-600 mt-1">Since {{ customer.membershipDate }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Last Login</h4>
            <p class="text-gray-800">{{ customer.lastLogin }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Account Status</h4>
            <span 
              [class]="customer.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ customer.accountStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  providers: [DatePipe]
})


export class ProfileComponent implements OnInit {
  editMode = false;
  customer!: Profile;
  
   constructor(private datePipe: DatePipe) {} 
 

  ngOnInit() {
    // In a real app, you would fetch customer data from a service
    // this.customerService.getProfile().subscribe(data => this.customer = data);
    this.customer = {
    profileImage: './assets/customerlogo.png',
    name: 'Mr. Delhi Ganesh I',
    email: 'delhi.ganesh@example.com',
    phone: '+91 9876543210',
    customerId: 'CUST-123456',
    address: '123, Main Street\nBangalore, Karnataka 560001',
    membershipType: 'Premium',
    membershipDate: this.formatDate(new Date('2022-01-15')), // Formatted date
    lastLogin: this.formatDate(new Date()),
    accountStatus: 'Active'
  };
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // In a real app, you would save changes here
      // this.customerService.updateProfile(this.customer).subscribe();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.customer.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy - hh:mm a') || '';
  }
}