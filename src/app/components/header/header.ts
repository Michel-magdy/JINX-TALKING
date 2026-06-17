import { Component, OnDestroy, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CartService } from '../../services/cart-service';
import { CartUiService } from '../../services/cart-ui.service';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  cartCount = 0;
  searchQuery = '';
  searchResults: IProduct[] = [];
  isSearchOpen = false;
  isSearching = false;
  isScrolled = false;

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  private search$ = new Subject<string>();
  private subs = new Subscription();

  constructor(
    private cartService: CartService,
    private cartUi: CartUiService,
    private productService: ProductService,
    private router: Router,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.cartService.getCart().subscribe((cart) => {
        this.cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      })
    );

    this.subs.add(
      this.search$
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          switchMap((query) => {
            this.isSearching = true;
            if (!query.trim()) {
              this.isSearching = false;
              return of([]);
            }
            return this.productService.searchProducts(query);
          })
        )
        .subscribe((results) => {
          this.searchResults = results.slice(0, 8);
          this.isSearching = false;
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement).tagName.toLowerCase();
    if (event.key === '/' && tag !== 'input' && tag !== 'textarea') {
      event.preventDefault();
      this.searchInputRef?.nativeElement.focus();
    }
    if (event.key === 'Escape') {
      this.closeSearch();
    }
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery = value;
    if (value.trim()) {
      this.isSearchOpen = true;
      this.search$.next(value);
    } else {
      this.closeSearch();
    }
  }

  onSearchFocus(): void {
    if (this.searchQuery.trim() && this.searchResults.length > 0) {
      this.isSearchOpen = true;
    }
  }

  goToProduct(productId: string): void {
    this.closeSearch();
    this.router.navigate(['/products', productId]);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.closeSearch();
  }

  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchResults = [];
    this.isSearching = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeSearch();
    }
  }

  closeMobileMenu(): void {
    const toggler = this.elRef.nativeElement.querySelector('.navbar-toggler') as HTMLElement;
    const collapse = this.elRef.nativeElement.querySelector('#navbarContent') as HTMLElement;
    if (collapse?.classList.contains('show')) {
      toggler?.click();
    }
  }

  scrollToFooter(): void {
    this.closeMobileMenu();
    const footer = document.querySelector('app-footer') as HTMLElement;
    footer?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleCart(): void {
    this.cartUi.toggle();
  }

  hasOriginalPrice(product: IProduct): boolean {
    return typeof product.originalPrice === 'number' && product.originalPrice > product.price;
  }
}
