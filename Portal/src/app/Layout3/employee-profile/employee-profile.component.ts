import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeProfile } from './employee-profile';
import { EmployeeProfileService } from './employee-profile.service';
import { Custid3Service } from '../../custid3.service';

@Component({
  selector: 'app-employee-profile',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Employee Profile</h2>
        <!-- <button 
          (click)="toggleEditMode()"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {{ editMode ? 'Save Changes' : 'Edit Profile' }}
        </button> -->
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Profile Picture and Basic Info -->
        <div class="flex flex-col items-center md:col-span-1">
          <div class="relative mb-4">
            <img 
              [src]="getProfileImage()" 
              alt="Profile Picture"
              class="w-40 h-40 rounded-full object-cover border-4 border-blue-200"
            >
            <input 
              *ngIf="editMode"
              type="file" 
              id="profileImage"
              class="hidden"
              (change)="handleImageUpload($event)"
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
          <h3 class="text-xl font-semibold text-gray-800">{{ profile.Vorna }} {{ profile.Nachn }}</h3>
          <p class="text-gray-600">Employee ID: {{ profile.Pernr }}</p>
          
          <div class="mt-4 w-full flex items-center ml-34">
            <label class="block font-medium text-gray-700 mb-1">Gender:</label>
            <select 
              *ngIf="editMode"
              [(ngModel)]="profile.Gesch"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Other</option>
            </select>
            <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">
              {{ getGenderText(profile.Gesch) }}
            </p>
          </div>
        </div>

        <!-- Personal Details -->
        <div class="md:col-span-2 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name:</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="profile.Vorna"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">{{ profile.Vorna }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name:</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="profile.Nachn"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">{{ profile.Nachn }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth:</label>
              <input 
                *ngIf="editMode"
                type="date"
                [(ngModel)]="profile.Gbdat"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">{{ formatDate(profile.Gbdat) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nationality:</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="profile.Natio"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">{{ getCountryName(profile.Natio) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Marital Status:</label>
              <select 
                *ngIf="editMode"
                [(ngModel)]="profile.Famst"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="S">Single</option>
                <option value="M">Married</option>
                <option value="D">Divorced</option>
                <option value="W">Widowed</option>
              </select>
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">
                {{ getMaritalStatus(profile.Famst) || 'Not specified' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">User Type:</label>
              <p class="px-1 py-1 text-gray-800">{{ getUserType(profile.Usrty) }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address:</label>
            <div *ngIf="editMode" class="space-y-2">
              <input 
                [(ngModel)]="profile.Stras"
                placeholder="Street"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <div class="grid grid-cols-2 gap-2">
                <input 
                  [(ngModel)]="profile.Ort01"
                  placeholder="City"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <input 
                  [(ngModel)]="profile.Pstlz"
                  placeholder="Postal Code"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>
            <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">
              {{ profile.Stras || 'Street not specified' }}<br>
              {{ profile.Ort01 || 'City not specified' }} {{ profile.Pstlz ? ', ' + profile.Pstlz : '' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Work Information Section -->
      <div class="mt-8 border-t pt-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Work Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Personnel Area</h4>
            <p class="text-gray-800">{{ profile.Btrtl || 'Not specified' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Personnel Subarea</h4>
            <p class="text-gray-800">{{ profile.Warks || 'Not specified' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Position</h4>
            <p class="text-gray-800">{{ profile.Plans || 'Not specified' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-section {
      transition: all 0.3s ease;
    }
    .edit-mode {
      background-color: #f0f9ff;
      border-left: 4px solid #3b82f6;
      padding-left: 12px;
    }
  `],
  providers: [DatePipe]
})
export class EmployeeProfileComponent implements OnInit {
  editMode = false;
  id = ''
  profile: EmployeeProfile = {
    Pernr: '',
    Vorna: '',
    Nachn: '',
    Gesch: '',
    Gbdat: '',
    Famst: '',
    Natio: '',
    Stras: '',
    Ort01: '',
    Pstlz: '',
    Usrid: '',
    Usrty: '',
    Warks: '',
    Btrtl: '',
    Plans: ''
  };
  profileImage: string | ArrayBuffer | null = null;
  
  constructor(
    private datePipe: DatePipe,
    private profileService: EmployeeProfileService,
    private custid:Custid3Service
  ) {}

  ngOnInit() {
    
    this.id = this.custid.getCustomerId()
    console.log(this.id)
    this.loadProfileData(this.id);
  }

  loadProfileData(id:string) {
    // Assuming you have a service method to get employee profile

    this.profileService.getEmployeeProfile(id).subscribe(data => {
      this.profile = data;
      // Set default values if empty
      for (const key in this.profile) {
        if (this.profile[key as keyof EmployeeProfile] === '') {
          this.profile[key as keyof EmployeeProfile] = 'Not specified';
        }
      }
    });
  }



  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result || null;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  getProfileImage() {
    return './assets/customerlogo.png';
  }

  getGenderText(genderCode: string): string {
    switch(genderCode) {
      case '1': return 'Male';
      case '2': return 'Female';
      default: return 'Other';
    }
  }

  getMaritalStatus(statusCode: string): string {
    switch(statusCode) {
      case 'S': return 'Single';
      case 'M': return 'Married';
      case 'D': return 'Divorced';
      case 'W': return 'Widowed';
      default: return 'Not specified';
    }
  }

  getUserType(typeCode: string): string {
    switch(typeCode) {
      case '0010': return 'Regular Employee';
      // Add more cases as needed
      default: return typeCode || 'Not specified';
    }
  }

  getCountryName(countryCode: string): string {
    // You can implement a more comprehensive country code to name mapping
    switch(countryCode) {
      case 'SA': return 'Saudi Arabia';
      case 'IN': return 'India';
      // Add more cases as needed
      default: return countryCode || 'Not specified';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    return this.datePipe.transform(dateString, 'mediumDate') || dateString;
  }
}
