import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mock-products';

// ══════════════════════════════════════════════════════════════════════
// STATIC DATA MODE — Supabase is paused.
// All CRUD operations work against in-memory arrays.
// Changes persist for the session only (they reset on page reload).
// When you reactivate Supabase, restore the original AdminService
// that uses SupabaseService (see git history).
// ══════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class AdminService {
  // In-memory data stores (cloned from mock so originals stay intact)
  private products: any[] = MOCK_PRODUCTS.map(p => this.toSupabaseRow(p));
  private categories: any[] = MOCK_CATEGORIES.map(c => ({ ...c }));
  private nextProductId = 100;
  private nextCategoryId = 100;

  // ── Auth ────────────────────────────────────────────────────────────

  login(password: string): boolean {
    if (password === environment.adminPassword) {
      sessionStorage.setItem('jinx_talking_admin', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('jinx_talking_admin');
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('jinx_talking_admin') === 'true';
  }

  // ── Products ────────────────────────────────────────────────────────

  async getProducts() {
    // Simulate async like Supabase
    return [...this.products].map(p => {
      const cat = this.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        categories: cat ? { name: cat.name, slug: cat.slug } : null,
      };
    });
  }

  async createProduct(product: Record<string, any>) {
    const newProduct = {
      ...product,
      id: String(this.nextProductId++),
      created_at: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Record<string, any>) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Product with id ${id} not found`);

    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  async deleteProduct(id: string) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Product with id ${id} not found`);

    this.products.splice(index, 1);
  }

  // ── Categories ──────────────────────────────────────────────────────

  async getCategories() {
    return [...this.categories];
  }

  async createCategory(category: Record<string, any>) {
    const newCategory = {
      ...category,
      id: `cat-${this.nextCategoryId++}`,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: string, updates: Record<string, any>) {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Category with id ${id} not found`);

    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  async deleteCategory(id: string) {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Category with id ${id} not found`);

    this.categories.splice(index, 1);
  }

  // ── Image Upload ────────────────────────────────────────────────────

  async uploadImage(file: File, _folder: string = 'products'): Promise<string> {
    // In static mode, create a local object URL as a stand-in
    // This URL will work during the current browser session
    return URL.createObjectURL(file);
  }

  async deleteImage(_publicUrl: string): Promise<void> {
    // No-op in static mode
  }

  // ── Stats ───────────────────────────────────────────────────────────

  async getStats() {
    return {
      totalProducts: this.products.length,
      totalCategories: this.categories.length,
    };
  }

  // ── Helper: Convert IProduct to Supabase-style row ─────────────────

  private toSupabaseRow(product: any): any {
    const category = MOCK_CATEGORIES.find(
      c => c.slug === product.categorySlug || c.name === product.category
    );
    return {
      id: product.id,
      name: product.name,
      slug: product.name.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: product.description,
      price: product.price,
      original_price: product.originalPrice ?? null,
      discount: product.discount ?? null,
      image: product.image,
      images: product.images ?? [],
      category_id: category?.id ?? null,
      category_name: product.category,
      stock: product.stock,
      sizes: product.sizes ?? [],
      colors: product.colors ?? [],
      rating: product.rating ?? 0,
      review_count: product.reviewCount ?? 0,
      featured: product.featured ?? false,
      created_at: new Date().toISOString(),
    };
  }
}
