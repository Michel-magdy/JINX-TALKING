import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCard } from './product-card';
import { IProduct } from '../../models/iproduct';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  const mockProduct: IProduct = {
    id: 'product-1',
    name: 'Test Product',
    description: 'Test description',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    image: 'assets/images/products/test.jpeg',
    images: [],
    rating: 4.5,
    reviewCount: 12,
    stock: 3,
    sizes: ['M'],
    colors: ['Black'],
    featured: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
