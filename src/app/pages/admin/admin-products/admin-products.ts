import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminHeaderComponent } from '../../../components/admin-header/admin-header';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload';
import { AdminService } from '../../../services/admin.service';
import { NotificationService } from '../../../services/notification.service';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number | null;
  original_price: number | null;
  discount: number | null;
  image: string;
  images: string[];
  category_id: string;
  category_name: string;
  stock: number | null;
  sizes: string;
  colors: string;
  rating: number | null;
  review_count: number | null;
  featured: boolean;
}

function emptyForm(): ProductForm {
  return {
    name: '', slug: '', description: '',
    price: null, original_price: null, discount: null,
    image: '', images: [],
    category_id: '', category_name: '',
    stock: null, sizes: '', colors: '',
    rating: null, review_count: null, featured: false,
  };
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent, ImageUploadComponent],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProductsPage implements OnInit {
  private admin = inject(AdminService);
  private notify = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  categories: any[] = [];
  loading = true;
  saving = false;

  showForm = false;
  editingId: string | null = null;
  form: ProductForm = emptyForm();

  // Pending file uploads
  mainImageFile: File | null = null;
  additionalImageFiles: File[] = [];

  // Delete confirmation
  deleteConfirmId: string | null = null;

  async ngOnInit() {
    await this.loadData();

    // Check for ?action=add query param
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'add') {
        this.openAddForm();
      }
    });
  }

  async loadData() {
    this.loading = true;
    try {
      const [products, categories] = await Promise.all([
        this.admin.getProducts(),
        this.admin.getCategories(),
      ]);
      this.products = products ?? [];
      this.categories = categories ?? [];
    } catch (e) {
      console.error('[AdminProducts] Load error:', e);
      this.notify.show('Failed to load products.', 'error');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  // ── Form: Open / Close ──────────────────────────────────────────

  openAddForm(): void {
    this.editingId = null;
    this.form = emptyForm();
    this.mainImageFile = null;
    this.additionalImageFiles = [];
    this.showForm = true;
  }

  openEditForm(product: any): void {
    this.editingId = product.id;
    this.form = {
      name: product.name ?? '',
      slug: product.slug ?? '',
      description: product.description ?? '',
      price: product.price,
      original_price: product.original_price,
      discount: product.discount,
      image: product.image ?? '',
      images: Array.isArray(product.images) ? [...product.images] : [],
      category_id: product.category_id ?? '',
      category_name: product.category_name ?? '',
      stock: product.stock,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      rating: product.rating,
      review_count: product.review_count,
      featured: product.featured ?? false,
    };
    this.mainImageFile = null;
    this.additionalImageFiles = [];
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form = emptyForm();
    this.mainImageFile = null;
    this.additionalImageFiles = [];
  }

  // ── Auto-generate slug from name ────────────────────────────────

  onNameChange(): void {
    if (!this.editingId) {
      this.form.slug = this.form.name
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }

  // ── Category change ─────────────────────────────────────────────

  onCategoryChange(): void {
    const selected = this.categories.find((c: any) => c.id === this.form.category_id);
    this.form.category_name = selected?.name ?? '';
  }

  // ── Image handlers ──────────────────────────────────────────────

  onMainImageSelected(file: File): void {
    this.mainImageFile = file;
  }

  onMainImageRemoved(): void {
    this.mainImageFile = null;
    this.form.image = '';
  }

  onAdditionalImagesSelected(files: File[]): void {
    this.additionalImageFiles.push(...files);
  }

  onAdditionalImageRemoved(index: number): void {
    // Determine if it's an existing URL or a pending file
    const existingCount = this.form.images.length;
    if (index < existingCount) {
      this.form.images.splice(index, 1);
    } else {
      this.additionalImageFiles.splice(index - existingCount, 1);
    }
  }

  // ── Save ────────────────────────────────────────────────────────

  async onSave(): Promise<void> {
    if (!this.form.name || !this.form.price || !this.form.description) {
      this.notify.show('Please fill in all required fields.', 'warning');
      return;
    }

    this.saving = true;

    try {
      // Upload main image if a new file was selected
      if (this.mainImageFile) {
        this.form.image = await this.admin.uploadImage(this.mainImageFile, 'products');
      }

      // Upload additional images
      if (this.additionalImageFiles.length > 0) {
        const uploadedUrls = await Promise.all(
          this.additionalImageFiles.map(f => this.admin.uploadImage(f, 'products'))
        );
        this.form.images = [...this.form.images, ...uploadedUrls];
      }

      // Build the data payload
      const payload: Record<string, any> = {
        name: this.form.name,
        slug: this.form.slug,
        description: this.form.description,
        price: this.form.price,
        original_price: this.form.original_price || null,
        discount: this.form.discount || null,
        image: this.form.image,
        images: this.form.images,
        category_id: this.form.category_id || null,
        category_name: this.form.category_name || null,
        stock: this.form.stock ?? 0,
        sizes: this.form.sizes ? this.form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: this.form.colors ? this.form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        rating: this.form.rating ?? 0,
        review_count: this.form.review_count ?? 0,
        featured: this.form.featured,
      };

      if (this.editingId) {
        await this.admin.updateProduct(this.editingId, payload);
        this.notify.show('Product updated successfully!', 'success');
      } else {
        await this.admin.createProduct(payload);
        this.notify.show('Product created successfully!', 'success');
      }

      this.closeForm();
      await this.loadData();
    } catch (e: any) {
      console.error('[AdminProducts] Save error:', e);
      this.notify.show(e.message || 'Failed to save product.', 'error');
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  // ── Delete ──────────────────────────────────────────────────────

  confirmDelete(id: string): void {
    this.deleteConfirmId = id;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  async onDelete(id: string): Promise<void> {
    try {
      await this.admin.deleteProduct(id);
      this.notify.show('Product deleted.', 'success');
      this.deleteConfirmId = null;
      await this.loadData();
    } catch (e: any) {
      console.error('[AdminProducts] Delete error:', e);
      this.notify.show(e.message || 'Failed to delete product.', 'error');
    }
  }
}
