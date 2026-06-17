import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart-service';
import { CartUiService } from '../../services/cart-ui.service';
import { IProduct } from '../../models/iproduct';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { ADMIN_WHATSAPP } from '../../services/cart-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: IProduct | undefined;
  error = '';
  selectedImage = '';
  selectedSize = '';
  selectedColor = '';
  relatedProducts: IProduct[] = [];
  expandedSection: string | null = null;
  whatsappNumber = ADMIN_WHATSAPP;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private cartUi: CartUiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.error = 'Product not found.';
        this.cdr.markForCheck();
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        if (data) {
          this.product = data;
          this.selectedImage = data.image;
          this.selectedSize = data.sizes?.[0] ?? '';
          this.selectedColor = data.colors?.[0] ?? '';
          this.error = '';
          this.cdr.markForCheck();
          this.loadRelatedProducts(data);
        } else {
          this.error = 'Product not found.';
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Error loading product details:', err);
        this.error = 'Failed to load product details. Please try again later.';
        this.cdr.markForCheck();
      }
    });
  }

  loadRelatedProducts(product: IProduct) {
    this.productService.getProducts().subscribe((allProducts) => {
      const sameCategoryProducts = allProducts.filter(
        (candidate) => candidate.id !== product.id && candidate.category === product.category
      );

      this.relatedProducts = sameCategoryProducts
        .slice(0, 4);

      if (this.relatedProducts.length < 4) {
        const extras = allProducts
          .filter((candidate) => candidate.id !== product.id && candidate.category !== product.category)
          .slice(0, 4 - this.relatedProducts.length);
        this.relatedProducts = [...this.relatedProducts, ...extras];
      }

      this.cdr.markForCheck();
    });
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  getColorSwatchColor(color: string): string {
    const normalized = color.trim().toLowerCase();
    const colorMap: Record<string, string> = {
      white: '#f5f5f5',
      black: '#111111',
      gray: '#6b7280',
      grey: '#6b7280',
      blue: '#2563eb',
      'light blue': '#60a5fa',
      'dark blue': '#1e3a8a',
      navy: '#1e3a8a',
      'navy blue': '#1e3a8a',
      khaki: '#bfa06a',
      brown: '#7c4a21',
      green: '#15803d',
      red: '#b91c1c',
      maroon: '#7f1d1d',
      cream: '#f3e7c9',
      yellow: '#facc15',
      pink: '#ec4899',
      indigo: '#4338ca',
      charcoal: '#374151',
      olive: '#65a30d',
    };

    return colorMap[normalized] ?? '#6b7280';
  }

  toggleSection(section: string) {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  purchaseViaWhatsapp() {
    if (this.product) {
      const size = this.selectedSize ? ` | Size: ${this.selectedSize}` : '';
      const color = this.selectedColor ? ` | Color: ${this.selectedColor}` : '';
      const message = `Hello, I would like to purchase *${this.product.name}*${size}${color} for ${this.product.price} EGP.`;
      const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  }

  onAddToCart() {
    if (this.product) {
      this.cartService.addToCart(
        this.product,
        1,
        this.selectedSize || undefined,
        this.selectedColor || undefined
      );
      this.cartUi.open();
    }
  }

  goToCategory(categorySlug: string | undefined) {
    if (categorySlug) {
      this.router.navigate(['/products'], { queryParams: { category: categorySlug } });
    }
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/products', productId]);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
