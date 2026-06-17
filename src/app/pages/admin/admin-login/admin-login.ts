import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLoginPage {
  password = '';
  error = '';
  loading = false;

  private admin = inject(AdminService);
  private router = inject(Router);

  onSubmit(): void {
    this.error = '';
    this.loading = true;

    // Small delay for UX feel
    setTimeout(() => {
      if (this.admin.login(this.password)) {
        this.router.navigate(['/admin']);
      } else {
        this.error = 'Incorrect password. Please try again.';
        this.loading = false;
      }
    }, 400);
  }
}
