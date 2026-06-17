import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { HomeCategories } from '../../components/home-sections/categories/categories';
import { HomeFeatured } from '../../components/home-sections/featured/featured';
import { HomeAccessories } from '../../components/home-sections/accessories/accessories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Footer,
    Header,
    HomeCategories,
    HomeFeatured,
    HomeAccessories,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  error = '';

  constructor(
    public router: Router,
  ) { }

  viewAllProducts() {
    this.router.navigate(['/products']);
  }
}
