import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, HttpResponse<unknown>>();

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const cacheKey = req.urlWithParams;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return of(cached.clone());
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(cacheKey, event.clone());
        }
      })
    );
  }
}
