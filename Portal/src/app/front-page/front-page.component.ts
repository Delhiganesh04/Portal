import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../Layout/button/button.component";
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterOutlet, ButtonComponent],
  template: `
    <div class="page-wrapper">
     
      <div class="help-button-container">
        <app-button title="Help" (btnClicked)="openOutlook()" />
      </div>
      
      <div class="welcome-container">
        <h1 class="welcome-text">
          <span *ngFor="let letter of welcomeLetters; let i = index" 
                class="letter" 
                [style.animation-delay]="i * 0.1 + 's'">
            {{letter}}
          </span>
        </h1>
      </div>
      <div class="card-container">
        <mat-card class="custom-card" *ngFor="let card of cards">
          <img mat-card-image [src]="card.img" alt="Card image">
          <mat-card-content>
            <p class="card-description">{{ card.description }}</p>
          </mat-card-content>
          <mat-card-actions class="card-actions">
            <app-button [title]="'Login'" (btnClicked)="navigateTo(card.route)"/>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .page-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #f3f4f6;
      padding: 2rem 0;
      position: relative;
    }
    .help-button-container {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .welcome-container {
      margin-bottom: 2rem;
      text-align: center;
    }
    .welcome-text {
      font-size: 3rem;
      font-weight: bold;
      color: #3f51b5;
      display: flex;
      justify-content: center;
    }
    .letter {
      display: inline-block;
      animation: pulseLetter 4s infinite;
      animation-delay: var(--delay);
    }
    @keyframes pulseLetter {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      50% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(20px);
      }
    }
    .card-container {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
      padding: 20px;
    }
    .custom-card {
      width: 280px;
      text-align: center;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .card-description {
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-actions {
      display: flex;
      justify-content: center;
      padding: 16px;
      margin-top: auto;
    }
    mat-card-image {
      object-fit: contain;
      height: 160px;
    }
  `]
})
export class FrontPageComponent {
  constructor(private router: Router) {}

  welcomeText = 'Welcome...';
  welcomeLetters = this.welcomeText.split('');

  cards = [
    {
      img: './assets/img1.png',
      description: 'Customer Portal Access',
      route: 'login'
    },
    {
      img: './assets/img2.png',
      description: 'Vendor Portal Access',
      route: 'login2'
    },
    {
      img: './assets/img3.png',
      description: 'Employee Portal Access',
      route: 'login3'
    }
  ];

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  openOutlook() {
    window.open('mailto:idelhiganesh@outlook.com', '_blank');
  }
}