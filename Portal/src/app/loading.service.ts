import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  private loadingMessage = new BehaviorSubject<string>('Loading...');
  loadingMessage$ = this.loadingMessage.asObservable();

  // Updated show method to accept optional message
  show(message?: string): void {
    if (message) {
      this.loadingMessage.next(message);
    }
    this.isLoading.next(true);
  }

  hide(): void {
    this.isLoading.next(false);
  }

  // Add the missing updateMessage method
  updateMessage(message: string): void {
    this.loadingMessage.next(message);
  }
}