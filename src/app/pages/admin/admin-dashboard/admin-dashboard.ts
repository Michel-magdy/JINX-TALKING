import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminHeaderComponent } from '../../../components/admin-header/admin-header';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminHeaderComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardPage implements OnInit {
  private admin = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  totalProducts = 0;
  totalCategories = 0;
  loading = true;

  async ngOnInit() {
    try {
      const stats = await this.admin.getStats();
      this.totalProducts = stats.totalProducts;
      this.totalCategories = stats.totalCategories;
    } catch (e) {
      console.error('[AdminDashboard] Failed to load stats:', e);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}
