import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../../models/iproduct';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImgLoaderDirective } from '../../directives/img-loader.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ImgLoaderDirective],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: IProduct;

  @Output() viewDetails = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<IProduct>();

  get discountedPrice(): number {
    return this.product.price;
  }

  get isInStock(): boolean {
    return this.product.stock > 0;
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.product.id);
  }

  onAddToCart(): void {
    if (this.isInStock) {
      this.addToCart.emit(this.product);
    }
  }

  get categoryDisplay(): string {
    return this.product.category || 'Uncategorized';
  }
}
