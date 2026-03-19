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
        status: string
    ): Observable<any> {
        const url = `${this.baseUrl}/rooms` +
            `?page=${page}` +
            `&limit=${limit}` +
            `&roomType=${roomType}` +
            `&status=${status}`

        return this.http.get(url);
    }

    getRoomTypes(): Observable<any> {
        return this.http.get(`${this.baseUrl}/room-types`);
    }
}