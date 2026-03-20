import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/reservations`;

  getReservations(
    page: number,
    limit: number,
    roomType: string,
    status: string,
    sortBy: string,
    sortOrder: string
  ): Observable<any> {
    const url = `${this.baseUrl}/get-reservations` +
      `?page=${page}` +
      `&limit=${limit}` +
      `&roomType=${roomType}` +
      `&status=${status}` +
      `&sortBy=${sortBy}` +
      `&sortOrder=${sortOrder}`;

    return this.http.get(url);
  }

  getRoomTypes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/manage-room/room-types`);
  }

  updateReservationStatus(
    id: number,
    payload: { status: string }
    ): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status`, payload);
    }
}

