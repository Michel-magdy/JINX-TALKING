import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, Observable } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { CartUiService } from '../../services/cart-ui.service';
import { ICart } from '../../models/icart';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css',
})
export class CartSidebar implements OnInit, OnDestroy {
  @Input() isOpen = false;

  cart$!: Observable<ICart>;
  itemCount = 0;
  private sub!: Subscription;

  constructor(
    private cartService: CartService,
    private cartUi: CartUiService
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.getCart();
    this.sub = this.cart$.subscribe((cart) => {
      this.itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  close(): void {
    this.cartUi.close();
  }

  updateQty(itemId: string, qty: number): void {
    this.cartService.updateQuantity(itemId, qty);
  }

  remove(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkoutWhatsApp(): void {
    this.cartService.checkoutWhatsApp();
  }
}
