import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartSidebar } from './components/cart-sidebar/cart-sidebar';
import { PreloaderComponent } from './components/preloader/preloader';
import { NotificationComponent } from './components/notification/notification';
import { CartUiService } from './services/cart-ui.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CartSidebar, PreloaderComponent, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  cartOpen = false;
  isInitialLoading = true;
  isAdminRoute = false;
  private sub!: Subscription;
  private preloaderTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(private cartUi: CartUiService, private router: Router) { }

  ngOnInit(): void {
    // Detect admin routes — skip preloader and cart sidebar
    this.isAdminRoute = this.router.url.startsWith('/admin');
    this.router.events.subscribe(() => {
      this.isAdminRoute = this.router.url.startsWith('/admin');
    });

    if (this.isAdminRoute) {
      this.isInitialLoading = false;
      return;
    }

    this.sub = this.cartUi.isOpen$.subscribe(v => (this.cartOpen = v));

    // Independent Preloader Timing:
    // - Always fast, never waits for the network.
    // - 600ms if data is already cached.
    // - 1200ms on first load.
    const hasCache = localStorage.getItem('prestige_cache_categories') !== null;
    const duration = hasCache ? 600 : 1200;

    this.preloaderTimeoutId = setTimeout(() => {
      this.isInitialLoading = false;
    }, duration);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.preloaderTimeoutId) {
      clearTimeout(this.preloaderTimeoutId);
    }
  }
}


