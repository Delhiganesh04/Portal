import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { LoadingService } from '../../loading.service';
import { HttpClient } from '@angular/common/http';
import { CustidVendService } from '../../custid-vend.service';

@Component({
  selector: 'app-login2',
  standalone: true,
  imports: [CommonModule, FormsModule,LoadingSpinnerComponent],
  template: `
     <app-loading-spinner/>
    <div class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-gray-800 font-sans">
      <!-- Top Left Logo -->
      <img src="./assets/kaar.png" alt="Logo Left" class="absolute top-4 left-4 w-20 h-20">

      <!-- Top Right Logo -->
      <img src="./assets/SAPLOGO.png" alt="Logo Right" class="absolute top-4 right-4 w-20 h-20">
      
      <div class="flex flex-col md:flex-row bg-transparent w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl">
        <!-- Welcome Section -->
        <div class="md:w-1/2 flex flex-col justify-center items-center text-white space-y-6 p-10">
          <img src="./assets/vendor.png" alt="LoginImg" class="w-30 h-30">
          <h1 class="text-5xl font-bold">Welcome to</h1>
          <p class="text-4xl text-gray-300 flex flex-wrap gap-1">
            <ng-container *ngFor="let letter of customerText.split(''); let i = index">
              <span
                [ngClass]="{
                  'text-blue-300': i >= customerText.indexOf('Portal')
                }"
                [style.animation-delay]="(i * 0.05) + 's'"
                class="opacity-0 animate-fade-in-up inline-block"
              >
                {{ letter }}
              </span>
            </ng-container>
          </p>
        </div>

        <!-- Login In Section -->
        <div class="md:w-1/2 bg-white/10 backdrop-blur p-10 text-white rounded-lg">
          <h2 class="text-4xl font-semibold mb-6 text-center">Login</h2>
          <form class="space-y-4">
            <div>
              <label class="block mb-1">Vendor ID</label>
              <input 
                type="text" 
                [(ngModel)]="username" 
                name="username" 
                placeholder="Vendor ID"
                class="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              />
            </div>

            <div>
              <label class="block mb-1">Password</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                placeholder="Password"
                class="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              />
            </div>

            <button 
              type="submit"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
              (click)="onSubmit()"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in-up {
      0%, 100% {
        opacity: 0;
        transform: translateY(20px);
      }
      50% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-10px);
      }
    }

    .animate-fade-in-up {
      animation: fade-in-up 5s ease-in-out infinite;
    }
  `]
})
export class Login2Component {
 customerText = 'Vendor Portal';
  username = '';
  password = '';

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private http:HttpClient,
    private custid:CustidVendService
  ) {}

async onSubmit() {
  this.loadingService.show('Authenticating...');
  if(this.username.length==0 || this.password.length==0){
    alert('Please Enter Id and Password')
  }
  else{
  try {
    const accountNo = this.username;
    const response: any = await this.http.get(`http://localhost:3000/getVendorDetails?accountNo=${accountNo}`).toPromise();
    console.log(response)

    if (response && response.AccountNo === this.username && response.Password === this.password) {
      this.custid.setCustomerId(this.username)
      this.loadingService.updateMessage('Loading dashboard...');
      
      setTimeout(() => {
        this.router.navigateByUrl("layout2")
          .then(() => this.loadingService.hide());
      }, 1000);
    } else {
      this.loadingService.hide();
      alert("INVALID CREDENTIALS");
    }
  } catch (error) {
    this.loadingService.hide();
    alert("ERROR FETCHING VENDOR DETAILS OR INVALID CREDENTIALS");
    console.error('Error:', error);
  }
}
}
}