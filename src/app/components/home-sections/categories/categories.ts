import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ICategory } from '../../../models/icategory';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeCategories implements OnInit {
  categories: ICategory[] = [];
  categoriesLoading = true;
  readonly categorySkeletons = Array.from({ length: 5 });

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.getCategories().subscribe((cats) => {
      this.categories = cats;
      this.categoriesLoading = false;
      this.cdr.detectChanges();
    });
  }

  navigateToCategory(slug: string) {
    this.router.navigate(['/products'], { queryParams: { category: slug } });
  }
}
