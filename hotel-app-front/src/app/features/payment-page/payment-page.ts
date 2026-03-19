import { Component } from '@angular/core';
import { PaymentMethodComponent } from './component/payment-method-component/payment-method-component';
import { DetailComponent } from './component/detail-component/detail-component';
import { DetailReservationComponent } from './component/detail-reservation-component/detail-reservation-component';

@Component({
  selector: 'app-payment-page',
  imports: [PaymentMethodComponent, DetailComponent, DetailReservationComponent],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss',
})
export class PaymentPage {
  constructor() {
    console.log('PaymentPage initialized');
  }
}
