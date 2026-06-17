import { Injectable, inject } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private notificationService = inject(NotificationService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'An unexpected error occurred. Please try again later.';
        let type: 'error' | 'warning' = 'error';

        if (error.status === 0) {
          message = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.status === 503) {
          message = 'The server is currently waking up (Cold Start). Please wait a moment while we prepare your experience...';
          type = 'warning';
        } else if (error.status >= 500) {
          message = 'The server encountered an error. We are working to resolve it.';
        }

        this.notificationService.show(message, type);
        
        return throwError(() => error);
      })
    );
  }
}
