import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Booking } from '../models/booking-model';
import { Payment } from '../models/payment-model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserBookings(userId: number) {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/booking-pending/${userId}`);
  }

  createPayment(payload: Payment) {
    return this.http.post<any>(`${this.apiUrl}/payment/create-payment`, payload);
  }
}
