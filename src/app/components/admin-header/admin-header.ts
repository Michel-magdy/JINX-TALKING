import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeaderComponent {
  private admin = inject(AdminService);
  private router = inject(Router);

  logout(): void {
    this.admin.logout();
    this.router.navigate(['/admin/login']);
  }
}
