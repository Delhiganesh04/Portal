import { Component } from '@angular/core';
import { LoadingService } from '../loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.isLoading$ | async" 
         class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div class="p-6 bg-white/10 rounded-lg backdrop-blur-md flex flex-col items-center">
        <!-- Spinner -->
        <!-- <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-transparent border-t-pink-500 border-r-orange-400 rounded-full animate-spin"></div>
          <div class="absolute inset-1 border-4 border-transparent border-b-pink-500 border-l-orange-400 rounded-full animate-spin-reverse"></div>
        </div> -->
        
        <!-- Loading Message -->
        <p class="mt-4 text-white text-center font-medium">
          {{ loadingService.loadingMessage$ | async }}
        </p>
        
        <!-- Optional Progress Bar -->
        <!-- <div *ngIf="showProgress" class="w-full bg-gray-200 rounded-full h-1.5 mt-4">
          <div class="bg-gradient-to-r from-pink-500 to-orange-400 h-1.5 rounded-full" 
               [style.width.%]="progress"></div>
        </div>
      </div> -->
    </div>
  `,
  styles: [`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin-reverse {
      to { transform: rotate(-360deg); }
    }
    .animate-spin-reverse {
      animation: spin-reverse 1.5s linear infinite;
    }
  `]
})
export class LoadingSpinnerComponent {
  showProgress = false;
  progress = 0;

  constructor(public loadingService: LoadingService) {}

  // Optional: Method to simulate progress
  // simulateProgress() {
  //   this.showProgress = true;
  //   this.progress = 0;
  //   const interval = setInterval(() => {
  //     this.progress += 5;
  //     if (this.progress >= 100) {
  //       clearInterval(interval);
  //     }
  //   }, 100);
  // }
}