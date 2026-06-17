import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart-service';
import { CartUiService } from '../../../services/cart-ui.service';
import { ProductCard } from '../../../components/product-card/product-card';
import { IProduct } from '../../../models/iproduct';

@Component({
  selector: 'app-home-featured',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './featured.html',
  styleUrl: './featured.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeFeatured implements OnInit {
  products: IProduct[] = [];
  productsLoading = true;
  readonly productSkeletons = Array.from({ length: 4 });

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cartUi: CartUiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.getFeaturedProducts().subscribe((data) => {
      this.products = data.slice(0, 3);
      this.productsLoading = false;
      this.cdr.markForCheck();
    });
  }

  onViewDetails(productId: string) {
    this.router.navigate(['/products', productId]);
  }

  onAddToCart(product: IProduct) {
    this.cartService.addToCart(product, 1);
    this.cartUi.open();
  }

  viewAllProducts() {
    this.router.navigate(['/products']);
  }
}
