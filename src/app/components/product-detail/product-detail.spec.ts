import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductDetail } from './product-detail';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart-service';
import { CartUiService } from '../../services/cart-ui.service';
import { IProduct } from '../../models/iproduct';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;

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
      imports: [ProductDetail],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: mockProduct.id })),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getProductById: () => of(mockProduct),
            getProducts: () => of([mockProduct]),
            searchProducts: () => of([]),
          },
        },
        {
          provide: CartService,
          useValue: {
            addToCart: () => undefined,
            getCart: () => of({ items: [], total: 0 }),
          },
        },
        {
          provide: CartUiService,
          useValue: {
            open: () => undefined,
            toggle: () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
