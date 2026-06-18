import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartSidebar } from './components/cart-sidebar/cart-sidebar';

import { NotificationComponent } from './components/notification/notification';
import { CartUiService } from './services/cart-ui.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CartSidebar, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  cartOpen = false;
  isAdminRoute = false;
  private sub!: Subscription;

  constructor(private cartUi: CartUiService, private router: Router) { }

  ngOnInit(): void {
    // Detect admin routes — skip preloader and cart sidebar
    this.isAdminRoute = this.router.url.startsWith('/admin');
    this.router.events.subscribe(() => {
      this.isAdminRoute = this.router.url.startsWith('/admin');
    });

    if (this.isAdminRoute) {
      return;
    }

    this.sub = this.cartUi.isOpen$.subscribe(v => (this.cartOpen = v));


  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();

  }
}


