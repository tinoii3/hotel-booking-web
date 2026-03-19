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

    searchRooms(checkIn: string, checkOut: string, type: string, adults: number, children: number): Observable<any> {
        let params = new HttpParams()
            .set('check_in', checkIn)
            .set('check_out', checkOut)
            .set('adults', adults.toString())
            .set('children', children.toString());

        if (type && type !== 'ทั้งหมด') {
            params = params.set('type', type);
        }

        return this.http.get(`${this.baseUrl}/search`, { params });
    }
    getRooms(
        page: number,
        limit: number,
        filter: string,
        sortBy: string,
        sortOrder: string
    ): Observable<any> {
        const url = `${this.baseUrl}/rooms` +
            `?page=${page}` +
            `&limit=${limit}` +
            `&filter=${filter}` +
            `&sortBy=${sortBy}` +
            `&sortOrder=${sortOrder}`

        return this.http.get(url);
    }
    createBooking(bookingData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/book`, bookingData);
    }
}
