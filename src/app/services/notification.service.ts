import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  autoDismiss?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  show(message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error', duration = 8000) {
    // Prevent duplicate notifications with the same message
    const existing = this.notificationsSubject.value.find(n => n.message === message);
    if (existing) return;

    const id = Math.random().toString(36).substring(2, 9);
    const notification: Notification = { id, message, type, autoDismiss: true };
    
    this.notificationsSubject.next([...this.notificationsSubject.value, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  remove(id: string) {
    const current = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(current);
  }
}
