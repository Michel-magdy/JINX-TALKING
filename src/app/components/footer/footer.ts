import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ADMIN_WHATSAPP } from '../../services/cart-service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  public currentYear = new Date().getFullYear();
  readonly whatsappHref = `https://wa.me/${ADMIN_WHATSAPP}`;
  readonly whatsappLabel = this.formatPhoneNumber(ADMIN_WHATSAPP);

  private formatPhoneNumber(phone: string): string {
    if (phone.startsWith('20') && phone.length === 12) {
      return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
    }

    return `+${phone}`;
  }
}
