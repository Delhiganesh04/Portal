import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { CustidService } from '../../custid.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BackButtonComponent],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-purple-700 text-white p-4 flex flex-col">
        <div class="flex-1">
          <div class="flex items-center space-x-2 p-4 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h1 class="text-xl font-bold">Customer Portal</h1>
          </div>
          <nav>
            <ul class="space-y-2">
              <li>
                <a 
                  [routerLink]="['/layout/profile']" 
                  routerLinkActive="bg-purple-800"
                  class="flex items-center px-4 py-2 rounded hover:bg-purple-800 transition gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </a>
              </li>
              <li>
                <a 
                  [routerLink]="['/layout/customer-dashboard']" 
                  routerLinkActive="bg-purple-800"
                  class="flex items-center px-4 py-2 rounded hover:bg-purple-800 transition gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Customer Dashboard
                </a>
              </li>
              <li>
                <a 
                  [routerLink]="['/layout/customer-financial']" 
                  routerLinkActive="bg-purple-800"
                  class="flex items-center px-4 py-2 rounded hover:bg-purple-800 transition gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Financial Sheet
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="px-4 py-3">
        <app-back-button/>
        </div>
        <!-- Logout Button at Bottom -->
        <div class="mt-auto p-4">
          <button 
            (click)="logout()"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-2xl transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-auto p-8">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: []
})
export class LayoutComponent {
  constructor(private router: Router,
              private custid:CustidService
  ) {}

  logout() {
    this.custid.clearCustomerId()
    this.router.navigate(['/frontpage']);

  }
}