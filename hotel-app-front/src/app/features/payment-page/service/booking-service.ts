import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Booking } from '../models/booking-model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserBookings(userId: number) {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/booking/${userId}`);
  }
}
