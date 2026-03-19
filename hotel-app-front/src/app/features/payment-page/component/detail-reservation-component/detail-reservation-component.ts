import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../core/services/token-service';
import { Booking } from '../../models/booking-model';
import { BookingService } from '../../service/booking-service';

@Component({
  selector: 'detail-reservation-component',
  templateUrl: './detail-reservation-component.html',
  styleUrl: './detail-reservation-component.scss',
})
export class DetailReservationComponent implements OnInit {

  booking: Booking | null = null;

  constructor(
    private bookingService: BookingService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    const decoded = this.tokenService.decodeToken();
    const userId = decoded?.sub;

    if (!userId) return;

    this.bookingService.getUserBookings(userId).subscribe({
      next: (res) => {
        const pending = res.find(b => b.status === 'PENDING');

        this.booking = pending || res[0];

        console.log('BOOKING DATA:', this.booking);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('th-TH');
  }
}