import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../models/iproduct';
import { ImgLoaderDirective } from '../../../directives/img-loader.directive';

@Component({
  selector: 'app-home-accessories',
  standalone: true,
  imports: [CommonModule, ImgLoaderDirective],
  templateUrl: './accessories.html',
  styleUrl: './accessories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAccessories implements OnInit {
  products: IProduct[] = [];
  productsLoading = true;
  readonly accessorySkeletons = Array.from({ length: 8 });

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      const accessories = products.filter((product) => this.isAccessoryProduct(product));
      const fallbackProducts = products.filter((product) => !product.featured);

      this.products = (
        accessories.length > 0
          ? accessories
          : fallbackProducts.length > 0
            ? fallbackProducts
            : products
      ).slice(0, 8);
      this.productsLoading = false;
      this.cdr.markForCheck();
    });
  }

  onViewDetails(productId: string) {
    this.router.navigate(['/products', productId]);
  }

  viewAllProducts() {
    this.router.navigate(['/products']);
  }

  private isAccessoryProduct(product: IProduct): boolean {
    const normalizedCategory = product.category.trim().toLowerCase();
    const normalizedSlug = product.categorySlug?.trim().toLowerCase() ?? '';

    return normalizedCategory === 'accessories' || normalizedSlug === 'accessories';
  }
}
