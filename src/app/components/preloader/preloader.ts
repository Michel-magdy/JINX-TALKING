import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preloader-overlay" [class.fade-out]="!isVisible" *ngIf="isMounted">
      <div class="loader-content">
        <div class="crown-container">
          <img src="assets/images/crown.png" alt="Prestige" class="preloader-logo">
          <div class="pulse-ring"></div>
        </div>
        <div class="loader-text">
          <span class="letter">P</span>
          <span class="letter">R</span>
          <span class="letter">E</span>
          <span class="letter">S</span>
          <span class="letter">T</span>
          <span class="letter">I</span>
          <span class="letter">G</span>
          <span class="letter">E</span>
        </div>
        <div class="loading-bar">
          <div class="bar-progress"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preloader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #121212;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .preloader-overlay.fade-out {
      opacity: 0;
      pointer-events: none;
    }

    .loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .crown-container {
      position: relative;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preloader-logo {
      width: 60px;
      height: auto;
      z-index: 2;
      filter: drop-shadow(0 0 10px rgba(212, 175, 53, 0.3));
    }

    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid #ffd700;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.5; }
      50% { transform: scale(1.2); opacity: 0; }
      100% { transform: scale(0.8); opacity: 0.5; }
    }

    .loader-text {
      display: flex;
      gap: 8px;
    }

    .letter {
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 24px;
      letter-spacing: 2px;
      animation: letterDrop 1.5s ease-in-out infinite;
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
    }

    .letter:nth-child(2) { animation-delay: 0.1s; }
    .letter:nth-child(3) { animation-delay: 0.2s; }
    .letter:nth-child(4) { animation-delay: 0.3s; }
    .letter:nth-child(5) { animation-delay: 0.4s; }
    .letter:nth-child(6) { animation-delay: 0.5s; }
    .letter:nth-child(7) { animation-delay: 0.6s; }
    .letter:nth-child(8) { animation-delay: 0.7s; }

    @keyframes letterDrop {
      0%, 100% { transform: translateY(0); opacity: 1; color: #fff; }
      50% { transform: translateY(-10px); opacity: 0.7; color: #ffd700; }
    }

    .loading-bar {
      width: 200px;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }

    .bar-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 30%;
      background: #ffd700;
      animation: progressMove 1.5s ease-in-out infinite;
      box-shadow: 0 0 10px #ffd700;
    }

    @keyframes progressMove {
      0% { left: -30%; }
      100% { left: 100%; }
    }
  `]
})
export class PreloaderComponent {
  @Input() isVisible = true;
  isMounted = true;

  ngOnChanges() {
    if (!this.isVisible) {
      setTimeout(() => {
        this.isMounted = false;
      }, 200); // Match transition duration
    }
  }
}

