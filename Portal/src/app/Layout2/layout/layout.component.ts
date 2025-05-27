import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { BackButtonComponent } from '../../back-button/back-button.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,BackButtonComponent],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar - Changed to light blue -->
      <div class="w-64 bg-blue-200 text-blue-800 p-4 flex flex-col border-r border-blue-100">
        <div class="flex-1">
          <div class="flex items-center space-x-2 p-4 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <h1 class="text-xl font-bold">Vendor Portal</h1>
          </div>
          <nav>
            <ul class="space-y-2">
              <li>
                <a 
                  [routerLink]="['/layout2/profile']" 
                  routerLinkActive="bg-blue-100 text-blue-700"
                  class="flex items-center px-4 py-2 rounded hover:bg-blue-250 transition gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </a>
              </li>
              <li>
                <a 
                  [routerLink]="['/layout2/cust-dash']" 
                  routerLinkActive="bg-blue-100 text-blue-700"
                  class="flex items-center px-4 py-2 rounded hover:bg-blue-250 transition gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Vendor Dashboard
                </a>
              </li>
              <li>
                <a 
                  [routerLink]="['/layout2/cust-finance']" 
                  routerLinkActive="bg-blue-100 text-blue-700"
                  class="flex items-center px-4 py-2 rounded hover:bg-blue-250 transition gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Vendor Finance
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
            class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition cursor-pointer"
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
  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/frontpage']);
  }
}

