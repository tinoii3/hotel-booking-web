import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoombookingService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/roombooking`;

    searchAvailableRooms(
        roomType: string | number,
        adults: number,
        children: number
    ): Observable<any> {
        let params = new HttpParams()
            .set('adults', adults.toString())
            .set('children', children.toString());

        if (roomType && roomType !== 'all') {
            params = params.set('room_type', roomType);
        }

        return this.http.get(`${this.baseUrl}/search`, { params });
    }

    createBooking(payload: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/booking`, payload);
    }

}
