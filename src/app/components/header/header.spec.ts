import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Header } from './header';
import { CartService } from '../../services/cart-service';
import { CartUiService } from '../../services/cart-ui.service';
import { ProductService } from '../../services/product.service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        {
          provide: CartService,
          useValue: {
            getCart: () => of({ items: [], total: 0 }),
          },
        },
        {
          provide: CartUiService,
          useValue: {
            toggle: () => undefined,
          },
        },
        {
          provide: ProductService,
          useValue: {
            searchProducts: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
