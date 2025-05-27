// back-button.component.ts
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  template: `
    <button (click)="goBack()" class="back-button gradient">
      <i class="material-icons">arrow_back</i> Back
    </button>
  `,
  styles: [`
    .back-button.gradient {
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      border: none;
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .back-button.gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    
    .back-button.gradient:active {
      transform: translateY(0);
    }
  `]
})
export class BackButtonComponent {
  constructor(private location:Location
  ) {}

  goBack() {
    this.location.back();
  }
}