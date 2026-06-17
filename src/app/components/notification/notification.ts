import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
  notifications$ = this.notificationService.notifications$;

  remove(id: string) {
    this.notificationService.remove(id);
  }
}
