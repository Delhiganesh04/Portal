import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { LoadingService } from '../../loading.service';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Add HttpClientModule
import { AuthService } from '../../auth.service';
import { CustidService } from '../../custid.service';


@Component({
  selector: 'app-login1',
  imports: [CommonModule, FormsModule,LoadingSpinnerComponent, HttpClientModule],
  template: `
  <app-loading-spinner/>
    <div class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 font-sans">
    <!-- Top Left Logo -->
    <img src="./assets/kaar.png" alt="Logo Left" class="absolute top-4 left-4 w-20 h-20">

<!-- Top Right Logo -->
<img src="./assets/SAPLOGO.png" alt="Logo Right" class="absolute top-4 right-4 w-20 h-20">
  <div class="flex flex-col md:flex-row bg-transparent w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl">

    <!-- Welcome Section -->
    <!-- <div class="md:w-1/2 p-10 text-white space-y-6"> -->
      <!-- <div class="text-3xl font-bold"></div> -->
      <div class="md:w-1/2 flex flex-col justify-center items-center text-white space-y-6 p-10">

       <img src="./assets/customer.png" alt="LoginImg" class="w-30 h-30">
      <h1 class="text-5xl font-bold">Welcome to</h1>
      <!-- <p class="text-gray-300 text-4xl">
       Customer <span class="text-pink-500">Portal</span>
      </p> -->
      <p class="text-4xl text-gray-300 flex flex-wrap gap-1">
  <ng-container *ngFor="let letter of customerText.split(''); let i = index">
    <span
      [ngClass]="{
        'text-pink-500': i >= customerText.indexOf('Portal')
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
      <h2 class="text-4xl font-semibold mb-6 text-center ">Login</h2>
      <form  class="space-y-4">
        <div>
          <label class="block mb-1">Customer ID</label>
          <input type="text" [(ngModel)]="this.id" name="id" placeholder="Customer ID"
            class="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>

        <div>
          <label class="block mb-1">Password</label>
          <input type="password" [(ngModel)]="this.password" name="password" placeholder="Password"
            class="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>

        <button type="submit"
          class="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded-full cursor-pointer"(click)="onSubmit()" >
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
export class LoginComponent {

 customerText = 'Customer Portal';
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private authService: AuthService,
    private custid :CustidService
  ) {}

  http = inject(HttpClient)

  

  id = '';
  password = '';
  loginMessage = '';



 onSubmit() {
  if(this.id.length==0 || this.password.length==0){
    alert('Please Enter Id and Password')
  }
  else{

  if (this.id.length<10){
    const loop = (10-(this.id.length))
    for(let i=0;i<loop;i++){
      this.id = '0' + this.id

    }
  }
  console.log(this.id)
  this.loadingService.show('Authenticating...');

  this.authService.login(this.id, this.password).subscribe({
    next: (res) => {
      this.loginMessage = res.message;

      if (res.status === 'Success') {
        this.custid.setCustomerId(this.id)
        this.loadingService.updateMessage('Loading dashboard...');
        
        setTimeout(() => {
          this.router.navigateByUrl("layout")
            .then(() => this.loadingService.hide());
        }, 1000);
      } else {
        this.loadingService.hide();
        alert("INVALID CREDENTIALS");
      }
    },
    error: () => {
      this.loadingService.hide();
      this.loginMessage = 'Login failed. Server error.';
      alert("SERVER ERROR");
    }
  });
}

}


}