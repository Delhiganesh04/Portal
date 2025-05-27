import { Component, OnInit } from '@angular/core';
import { CommonModule ,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from './profile';
import { ProfileService } from './profile.service';
import { CustidService } from '../../custid.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Customer Profile</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Profile Picture -->
        <div class="flex flex-col items-center">
          <div class="relative mb-4">
            <img 
              [src]="'./assets/customerlogo.png'" 
              alt="Profile Picture"
              class="w-50 h-50 rounded-full object-cover border-4 border-blue-200"
            >
            <input 
              *ngIf="editMode"
              type="file" 
              id="profileImage"
              class="hidden"
              
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
          <h3 class="text-xl font-semibold text-gray-800">{{ profile.Name1 }}</h3>
          <p class="text-gray-600">CUST-ID:{{ profile.Kunnr }}</p>
        </div>

        <!-- Customer Details -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name:</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="profile.Name1"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">{{ profile.Name1 }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="email"
                type="email"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">{{ email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="phone"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">{{ phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Customer ID:</label>
              <p class="px-1 py-1 text-gray-800">{{ profile.Kunnr }}</p>
            </div>
          </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address:</label>
              <input 
                *ngIf="editMode"
                [(ngModel)]="profile.Ort01"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p *ngIf="!editMode" class="px-1 py-1 text-gray-800">{{ profile.Stras }},{{ profile.Ort01 }}</p>
            
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location:</label>
              <p class="px-1 py-1 text-gray-800">{{ profile.Land1 }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pincode:</label>
            <textarea 
              *ngIf="editMode"
              [(ngModel)]="profile.Ort01"
              rows="3"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <p *ngIf="!editMode" class="px-1 py-1 text-gray-800 whitespace-pre-line">{{ profile.Pstlz }}</p>
          </div>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="mt-8 border-t pt-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Membership</h4>
            <p class="text-blue-600 font-semibold">{{ membershipType }}</p>
            <p class="text-sm text-gray-600 mt-1">Since {{ membershipDate }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Last Login</h4>
            <p class="text-gray-800">{{ lastLogin }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Account Status</h4>
            <span 
              [class]="accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ accountStatus }}
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
  profile:Profile ={
  Kunnr: "string",
  Land1: "string",
  Name1: "string",
  Ort01: "string",
  Pstlz: "string",
  Regio: "string",
  Sortl: "string",
  Stras: "string",
  Telf1: "string",
  Telex: "string",
  Xcpdk: "string",
  Adrnr: "string",
}

  
  membershipType = 'Premium'
  accountStatus= 'Active'
  email =''
  phone = '8939229680'
  profileImage= './assets/customerlogo.png'
  membershipDate!: string;
  lastLogin!: string;
  id=''
  
   constructor(private datePipe: DatePipe,
    private profileService: ProfileService,
    private custid:CustidService
   ) {} 

  ngOnInit() {
    
  this.id=this.custid.getCustomerId() 
  this.membershipDate = this.formatDate(new Date('2022-01-15'));
  this.lastLogin = this.formatDate(new Date());

  this.profileService.getProfile(this.id).subscribe(data => {
    for (let key in data) {
      if (data[key] === '' || data[key] == null) {
        data[key] = 'nill';
      }
    }
    this.profile = data;
    console.log(this.profile)
    this.email = this.profile.Sortl + '@gmail.com';
  });
  }

  
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy - hh:mm a') || '';
  }
}