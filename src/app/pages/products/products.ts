import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart-service';
import { CartUiService } from '../../services/cart-ui.service';
import { IProduct } from '../../models/iproduct';
import { ICategory } from '../../models/icategory';
import { ProductCard } from '../../components/product-card/product-card';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard, Header, Footer],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsPage implements OnInit {
  products: IProduct[] = [];
  allProducts: IProduct[] = [];
  categories: ICategory[] = [];
  activeCategory: ICategory | null = null;
  activeSlug: string | null = null;
  error = '';
  loading = true;
  categoriesLoading = true;
  readonly categorySkeletons = Array.from({ length: 6 });
  readonly productSkeletons = Array.from({ length: 8 });

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cartUi: CartUiService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.productService.getCategories().subscribe((cats) => {
      this.categories = cats;
      this.categoriesLoading = false;
      this.syncActiveCategory();
      this.cdr.markForCheck();
    });

    this.route.queryParams
      .pipe(
        map((params) => params['category'] || null),
        distinctUntilChanged(),
        switchMap((slug) => {
          this.activeSlug = slug;
          this.syncActiveCategory();
          this.loading = true;
          this.cdr.markForCheck();

          return slug ? this.productService.getBySlug(slug) : this.productService.getProducts();
        })
      )
      .subscribe((data) => {
        this.products = data;
        this.error = '';
        this.loading = false;
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

  selectCategory(slug: string | null) {
    if (slug) {
      this.router.navigate(['/products'], { queryParams: { category: slug } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  private syncActiveCategory(): void {
    this.activeCategory = this.activeSlug
      ? this.categories.find((category) => category.slug === this.activeSlug) ?? null
      : null;
  }
}
