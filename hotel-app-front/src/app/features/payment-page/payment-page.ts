import { Component, ViewChild } from '@angular/core';
import { PaymentMethodComponent } from './component/payment-method-component/payment-method-component';
import { DetailComponent } from './component/detail-component/detail-component';
import { DetailReservationComponent } from './component/detail-reservation-component/detail-reservation-component';
import { UserService } from '../../core/services/user-service';
import { Booking } from './models/booking-model';
import { PaymentService } from './service/payment-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userService.loadProfile().subscribe();

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
    if (!this.userService.getSnapshot()) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบก่อน',
        text: 'คุณต้องเข้าสู่ระบบก่อนทำรายการชำระเงิน',
        confirmButtonColor: '#000000',
      }).then(() => {
        this.router.navigate(['/auth/login']);
      });

      return;
    }

    if (!this.booking) {
      Swal.fire({
        icon: 'warning',
        title: 'ไม่มีรายการจอง',
        text: 'กรุณาเลือกห้องก่อนทำการชำระเงิน',
        confirmButtonColor: '#000000',
      });
      return;
    }

    this.detailComp.markAllTouched();
    this.paymentComp.markAllTouched();

    if (!this.canSubmit()) {
      return;
    }

    const payload = {
      booking_id: this.booking!.id,
      first_name: this.detailForm.first_name,
      last_name: this.detailForm.last_name,
      email: this.detailForm.email,
      phone: this.detailForm.phone,
      note: this.detailForm.note,
      payment_method: 'CREDIT CARD',
    };

    this.paymentService.createPayment(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'ชำระเงินสำเร็จ 🎉',
          text: 'การจองของคุณได้รับการยืนยันแล้ว',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/hotel']);
        });
      },
      error: (err) => {
        console.error('Payment failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'ชำระเงินไม่สำเร็จ',
          text: err.error?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
          confirmButtonColor: '#1e3a5f',
        });
      },
    });
  }

  canSubmit(): boolean {
    return this.detailValid && this.paymentValid && !!this.booking;
  }

  onCancelBooking() {
    if (!this.booking) return;

    Swal.fire({
      icon: 'warning',
      title: 'ยืนยันการยกเลิกการจอง',
      text: 'คุณต้องการยกเลิกการจองนี้หรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'ยกเลิกการจอง',
      cancelButtonText: 'กลับ',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentService.cancelBooking(this.booking!.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'ยกเลิกการจองเรียบร้อย',
              timer: 1500,
              showConfirmButton: false,
            });
            this.booking!.status = 'CANCELED';
            this.router.navigate(['/hotel']);
          },
          error: (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: err.error?.message || 'ไม่สามารถยกเลิกการจองได้',
            });
          },
        });
      }
    });
  }
}
