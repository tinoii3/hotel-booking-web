import { Component, ViewChild } from '@angular/core';
import { PaymentMethodComponent } from './component/payment-method-component/payment-method-component';
import { DetailComponent } from './component/detail-component/detail-component';
import { DetailReservationComponent } from './component/detail-reservation-component/detail-reservation-component';
import { UserService } from '../../core/services/user-service';
import { Booking } from './models/booking-model';
import { BookingStatus } from '../../core/constants/status.constanst';
import { PaymentStatus } from '../../core/constants/status.constanst';

@Component({
  selector: 'app-payment-page',
  imports: [PaymentMethodComponent, DetailComponent, DetailReservationComponent],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss',
})
export class PaymentPage {
  @ViewChild(DetailComponent) detailComp!: DetailComponent;
  @ViewChild(PaymentMethodComponent) paymentComp!: PaymentMethodComponent;

  detailForm: any = null;
  paymentForm: any = null;
  booking: Booking | null = null;

  detailValid = false;
  paymentValid = false;
  user_id: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      if (!user) return;

      this.user_id = user.id;
    });
  }

  onDetailChange(event: any) {
    this.detailForm = event.value;
    this.detailValid = event.valid;
  }

  onPaymentChange(event: any) {
    this.paymentForm = event.value;
    this.paymentValid = event.valid;
  }

  onBookingChange(booking: Booking) {
    this.booking = booking;
  }

  onSubmitPayment() {
    this.detailComp.markAllTouched();
    this.paymentComp.markAllTouched();

    if (!this.canSubmit()) {
      return;
    }

    const payload = {
      booking_id: this.booking!.id,
      booking: {
        user_id: this.user_id,
        first_name: this.detailForm.first_name,
        last_name: this.detailForm.last_name,
        email: this.detailForm.email,
        phone: this.detailForm.phone,
        note: this.detailForm.note,
        status: BookingStatus.CONFIRMED,
      },
      payment: {
        payment_method: 'CARD',
        amount: this.booking!.total_price,
        status: PaymentStatus.COMPLETED,
        pay_at: new Date(),
      },
    };

    console.log('🔥 FINAL PAYLOAD:', payload);

    // this.paymentService.pay(payload).subscribe(...)
  }
  canSubmit(): boolean {
    return this.detailValid && this.paymentValid && !!this.booking;
  }
}
