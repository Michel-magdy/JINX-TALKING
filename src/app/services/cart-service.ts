import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICart } from '../models/icart';
import { ICartItem } from '../models/icart-item';
import { IProduct } from '../models/iproduct';

// Set the admin's WhatsApp number here (include country code, no + or spaces)
export const ADMIN_WHATSAPP = '201228630310';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'jinx_talking_cart';
  private cart$ = new BehaviorSubject<ICart>({ items: [], total: 0 });

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.cart$.next(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('[CartService] Failed to load cart', e);
    }
  }

  private saveCart(cart: ICart): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('[CartService] Failed to save cart', e);
    }
  }

  getCart(): Observable<ICart> {
    return this.cart$.asObservable();
  }

  get cartSnapshot(): ICart {
    return this.cart$.value;
  }

  get itemCount(): number {
    return this.cart$.value.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  addToCart(product: IProduct, quantity: number = 1, size?: string, color?: string): void {
    const finalSize = size || product.sizes?.[0];
    const finalColor = color || product.colors?.[0];

    const current = this.cart$.value;
    const existingIndex = current.items.findIndex(
      (item) => item.productId === product.id && item.size === finalSize && item.color === finalColor
    );

    let updatedItems: ICartItem[];
    if (existingIndex > -1) {
      updatedItems = current.items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem: ICartItem = {
        id: `${product.id}-${finalSize ?? ''}-${finalColor ?? ''}-${Date.now()}`,
        productId: product.id,
        product,
        quantity,
        size: finalSize,
        color: finalColor,
        price: product.price,
      };
      updatedItems = [...current.items, newItem];
    }

    const newCart = {
      items: updatedItems,
      total: this.calcTotal(updatedItems),
    };
    this.cart$.next(newCart);
    this.saveCart(newCart);
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(itemId);
      return;
    }
    const current = this.cart$.value;
    const updatedItems = current.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    const newCart = { items: updatedItems, total: this.calcTotal(updatedItems) };
    this.cart$.next(newCart);
    this.saveCart(newCart);
  }

  removeFromCart(itemId: string): void {
    const current = this.cart$.value;
    const updatedItems = current.items.filter((item) => item.id !== itemId);
    const newCart = { items: updatedItems, total: this.calcTotal(updatedItems) };
    this.cart$.next(newCart);
    this.saveCart(newCart);
  }

  clearCart(): void {
    const newCart = { items: [], total: 0 };
    this.cart$.next(newCart);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  checkoutWhatsApp(phone: string = ADMIN_WHATSAPP): void {
    const cart = this.cart$.value;
    if (cart.items.length === 0) {
      return;
    }

    const itemLines = cart.items
      .map((item) => {
        const details = [item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
          .filter(Boolean)
          .join(', ');
        const linePrice = (item.price * item.quantity).toLocaleString();

        return `- ${item.product.name}${details ? ` (${details})` : ''} - Qty: ${item.quantity} - ${linePrice} LE`;
      })
      .join('\n');

    const total = cart.total.toLocaleString();
    const message = `Hello! I'd like to place an order:\n\n${itemLines}\n\n*Total: ${total} LE*\n\nPlease confirm availability. Thank you.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  }

  private calcTotal(items: ICartItem[]): number {
    return items.reduce((sum: number, item: ICartItem) => sum + item.price * item.quantity, 0);
  }
}
