import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustidVendService } from '../../custid-vend.service';

interface Profile {
  profileImage?: string;
  name: string;
  email?: string;
  phone?: string;
  customerId: string;
  address: string;
  membershipType?: string;
  membershipDate?: string;
  lastLogin?: string;
  accountStatus?: string;
  city?: string;
  postalCode?: string;
  region?: string;
  country?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Vendor Profile</h2>
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
          </div>
          <h3 class="text-xl font-semibold text-gray-800">{{ customer.name }}</h3>
          <p class="text-gray-600">{{ customer.customerId }}</p>
        </div>

        <!-- Vendor Details -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <p class="px-1 py-2 text-gray-800">{{ customer.customerId }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p class="px-1 py-2 text-gray-800">{{ customer.name }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <p class="px-1 py-2 text-gray-800">{{ customer.city }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <p class="px-1 py-2 text-gray-800">{{ customer.postalCode }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <p class="px-1 py-2 text-gray-800">{{ customer.region }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <p class="px-1 py-2 text-gray-800">{{ customer.country }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <p class="px-1 py-2 text-gray-800 whitespace-pre-line">{{ customer.address }}</p>
          </div>
        </div>
      </div>

      <!-- Additional Information Section----->
      
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
  customer!: Profile;
    membershipType = 'Premium'
  accountStatus= 'Active'
  email =''
  phone = '8939229680'
  // profileImage= './assets/customerlogo.png'
  membershipDate!: string;
  lastLogin!: string;

  constructor(private datePipe: DatePipe, private http: HttpClient, private custid: CustidVendService) {}

  ngOnInit() {
    this.fetchVendorDetails();
      this.membershipDate = this.formatDate(new Date('2022-01-15'));
  this.lastLogin = this.formatDate(new Date());
  }

  fetchVendorDetails() {

    const accountNo = this.custid.getCustomerId()
    
    this.http.get(`http://localhost:3000/getVendorDetails?accountNo=${accountNo}`).subscribe(
      (response: any) => {
        this.customer = {
          profileImage: './assets/customerlogo.png',
          name: response.Name,
          customerId: response.AccountNo,
          address: `${response.AddressPrefix || ''}, ${response.City} - ${response.PostalCode}.`,
          city: response.City,
          postalCode: response.PostalCode,
          region: response.Region,
          country: response.CountryKey,
          membershipType: response.AddressGroup,
          lastLogin: response.SortField,
          accountStatus: 'Active'
        };
      },
      (error) => {
        console.error('Error fetching vendor details:', error);
        this.customer = this.getDefaultProfile();
      }
    );
  }

  private getDefaultProfile(): Profile {
    return {
      profileImage: './assets/customerlogo.png',
      name: 'Vendor Name',
      customerId: '0000000000',
      address: 'Default Address',
      city: 'Default City',
      postalCode: '000000',
      region: 'Default Region',
      country: 'IN',
      membershipType: 'KRED',
      lastLogin: 'Default Sort Field',
      accountStatus: 'Active'
    };
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy - hh:mm a') || '';
  }
}