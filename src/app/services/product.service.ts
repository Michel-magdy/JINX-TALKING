import { Injectable } from '@angular/core';
import { Observable, of, shareReplay, map } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { ICategory } from '../models/icategory';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mock-products';

// ══════════════════════════════════════════════════════════════════════
// STATIC DATA MODE — Supabase is paused.
// When you reactivate Supabase, restore the original ProductService
// that uses SupabaseService (see git history).
// ══════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products$?: Observable<IProduct[]>;
  private categories$?: Observable<ICategory[]>;
  private featuredProducts$?: Observable<IProduct[]>;
  private productByIdCache = new Map<string, Observable<IProduct | undefined>>();
  private productsByCategory = new Map<string, IProduct[]>();
  private productsByCategorySlug = new Map<string, IProduct[]>();
  private searchIndex: Array<{ product: IProduct; searchText: string }> = [];

  // ── Product indexes (unchanged) ──────────────────────────────────

  private rebuildProductIndexes(products: IProduct[]): void {
    const byCategory = new Map<string, IProduct[]>();
    const byCategorySlug = new Map<string, IProduct[]>();

    for (const product of products) {
      const normalizedCategory = product.category.trim().toLowerCase();
      const slug = product.categorySlug?.trim().toLowerCase() || toSlug(product.category);

      byCategory.set(normalizedCategory, [...(byCategory.get(normalizedCategory) ?? []), product]);
      byCategorySlug.set(slug, [...(byCategorySlug.get(slug) ?? []), product]);
    }

    this.productsByCategory = byCategory;
    this.productsByCategorySlug = byCategorySlug;
    this.searchIndex = products.map((product) => ({
      product,
      searchText: `${product.name} ${product.description} ${product.category}`.toLowerCase(),
    }));
  }

  // ── Products ─────────────────────────────────────────────────────

  getProducts(): Observable<IProduct[]> {
    if (this.products$) {
      return this.products$;
    }

    // Use static data instead of Supabase
    const products = [...MOCK_PRODUCTS];
    this.rebuildProductIndexes(products);

    this.products$ = of(products).pipe(shareReplay(1));
    return this.products$;
  }

  getProductById(id: string): Observable<IProduct | undefined> {
    const cachedRequest = this.productByIdCache.get(id);
    if (cachedRequest) {
      return cachedRequest;
    }

    // Find in static data
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    const result$ = of(product).pipe(shareReplay(1));
    this.productByIdCache.set(id, result$);
    return result$;
  }

  getByCategory(category: string): Observable<IProduct[]> {
    const normalizedCategory = category.trim().toLowerCase();

    return this.getProducts().pipe(
      map(() => this.productsByCategory.get(normalizedCategory) ?? [])
    );
  }

  getBySlug(slug: string): Observable<IProduct[]> {
    const normalizedSlug = slug.trim().toLowerCase();

    if (!normalizedSlug) {
      return of([]);
    }

    return this.getProducts().pipe(
      map(() => this.productsByCategorySlug.get(normalizedSlug) ?? [])
    );
  }

  // ── Featured Products ────────────────────────────────────────────

  getFeaturedProducts(): Observable<IProduct[]> {
    if (this.featuredProducts$) {
      return this.featuredProducts$;
    }

    // Use static data — filter featured products
    const featured = MOCK_PRODUCTS.filter(p => p.featured);
    // Fallback: if no featured products, return first 6
    const result = featured.length > 0 ? featured : MOCK_PRODUCTS.slice(0, 6);

    this.featuredProducts$ = of(result).pipe(shareReplay(1));
    return this.featuredProducts$;
  }

  // ── Categories ───────────────────────────────────────────────────

  getCategories(): Observable<ICategory[]> {
    if (this.categories$) {
      return this.categories$;
    }

    // Use static data instead of Supabase
    this.categories$ = of([...MOCK_CATEGORIES]).pipe(shareReplay(1));
    return this.categories$;
  }

  // ── Search ───────────────────────────────────────────────────────

  searchProducts(query: string): Observable<IProduct[]> {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return of([]);
    }

    // Performance: If we already have the index, just filter it immediately
    if (this.searchIndex.length > 0) {
      const results = this.searchIndex
        .filter((item) => item.searchText.includes(normalizedQuery))
        .map((item) => item.product);
      return of(results);
    }

    // Fallback: If not indexed yet, load products first, then search
    return this.getProducts().pipe(
      map(() => {
        return this.searchIndex
          .filter((item) => item.searchText.includes(normalizedQuery))
          .map((item) => item.product);
      })
    );
  }
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
