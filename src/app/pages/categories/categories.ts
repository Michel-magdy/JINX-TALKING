import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ICategory } from '../../models/icategory';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesPage implements OnInit {
  categories: ICategory[] = [];
  loading = true;
  readonly categorySkeletons = Array.from({ length: 5 });

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.getCategories().subscribe((cats) => {
      this.categories = cats;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  navigateTo(slug: string) {
    this.router.navigate(['/products'], { queryParams: { category: slug } });
  }
}
