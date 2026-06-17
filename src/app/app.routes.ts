import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomePage) },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories').then(m => m.CategoriesPage) },
  { path: 'products', loadComponent: () => import('./pages/products/products').then(m => m.ProductsPage) },
  { path: 'products/:id', loadComponent: () => import('./components/product-detail/product-detail').then(m => m.ProductDetail) },

  // Admin routes
  { path: 'admin/login', loadComponent: () => import('./pages/admin/admin-login/admin-login').then(m => m.AdminLoginPage) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardPage) },
  { path: 'admin/products', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-products/admin-products').then(m => m.AdminProductsPage) },
  { path: 'admin/categories', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-categories/admin-categories').then(m => m.AdminCategoriesPage) },
];

