import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminHeaderComponent } from '../../../components/admin-header/admin-header';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload';
import { AdminService } from '../../../services/admin.service';
import { NotificationService } from '../../../services/notification.service';

interface CategoryForm {
  name: string;
  slug: string;
  image: string;
  product_count: number | null;
}

function emptyForm(): CategoryForm {
  return { name: '', slug: '', image: '', product_count: 0 };
}

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent, ImageUploadComponent],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategoriesPage implements OnInit {
  private admin = inject(AdminService);
  private notify = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  categories: any[] = [];
  loading = true;
  saving = false;

  showForm = false;
  editingId: string | null = null;
  form: CategoryForm = emptyForm();
  imageFile: File | null = null;

  deleteConfirmId: string | null = null;

  async ngOnInit() {
    await this.loadData();

    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'add') {
        this.openAddForm();
      }
    });
  }

  async loadData() {
    this.loading = true;
    try {
      this.categories = (await this.admin.getCategories()) ?? [];
    } catch (e) {
      console.error('[AdminCategories] Load error:', e);
      this.notify.show('Failed to load categories.', 'error');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  openAddForm(): void {
    this.editingId = null;
    this.form = emptyForm();
    this.imageFile = null;
    this.showForm = true;
  }

  openEditForm(cat: any): void {
    this.editingId = cat.id;
    this.form = {
      name: cat.name ?? '',
      slug: cat.slug ?? '',
      image: cat.image ?? '',
      product_count: cat.product_count ?? 0,
    };
    this.imageFile = null;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form = emptyForm();
    this.imageFile = null;
  }

  onNameChange(): void {
    if (!this.editingId) {
      this.form.slug = this.form.name
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }

  onImageSelected(file: File): void {
    this.imageFile = file;
  }

  onImageRemoved(): void {
    this.imageFile = null;
    this.form.image = '';
  }

  async onSave(): Promise<void> {
    if (!this.form.name) {
      this.notify.show('Please enter a category name.', 'warning');
      return;
    }

    this.saving = true;

    try {
      if (this.imageFile) {
        this.form.image = await this.admin.uploadImage(this.imageFile, 'categories');
      }

      const payload: Record<string, any> = {
        name: this.form.name,
        slug: this.form.slug,
        image: this.form.image || null,
        product_count: this.form.product_count ?? 0,
      };

      if (this.editingId) {
        await this.admin.updateCategory(this.editingId, payload);
        this.notify.show('Category updated successfully!', 'success');
      } else {
        await this.admin.createCategory(payload);
        this.notify.show('Category created successfully!', 'success');
      }

      this.closeForm();
      await this.loadData();
    } catch (e: any) {
      console.error('[AdminCategories] Save error:', e);
      this.notify.show(e.message || 'Failed to save category.', 'error');
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  confirmDelete(id: string): void {
    this.deleteConfirmId = id;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  async onDelete(id: string): Promise<void> {
    try {
      await this.admin.deleteCategory(id);
      this.notify.show('Category deleted.', 'success');
      this.deleteConfirmId = null;
      await this.loadData();
    } catch (e: any) {
      console.error('[AdminCategories] Delete error:', e);
      this.notify.show(e.message || 'Failed to delete category.', 'error');
    }
  }
}
