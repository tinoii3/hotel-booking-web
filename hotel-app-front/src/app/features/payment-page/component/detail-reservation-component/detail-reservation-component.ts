import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TokenService } from '../../../../core/services/token-service';
import { Booking } from '../../models/booking-model';
import { BookingService } from '../../service/booking-service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'detail-reservation-component',
  templateUrl: './detail-reservation-component.html',
  styleUrl: './detail-reservation-component.scss',
  imports: [DecimalPipe]
})
export class DetailReservationComponent implements OnInit {
  @Output() bookingLoaded = new EventEmitter<Booking>();

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
        this.bookingLoaded.emit(this.booking);
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