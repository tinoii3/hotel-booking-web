import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ManageRoomService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/manage-room`;

    getRooms(
        page: number,
        limit: number,
        type: string = 'all',
        sortBy: string = 'room_number',
        sortOrder: string = 'asc'
    ): Observable<any> {
        const url = `${this.baseUrl}/rooms` +
            `?page${page}` +
            `&limit=${limit}` +
            `&type=${type}` +
            `&sortBy=${sortBy}` +
            `&sortOrder=${sortOrder}`

        return this.http.get(url);
    }

    getRoomTypes(): Observable<any> {
        return this.http.get(`${this.baseUrl}/room-types`);
    }

    createRoom(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/rooms`, payload);
    }

    updateRoom(id: number, payload: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}/rooms/${id}`, payload);
    }

    deleteRoom(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/rooms/${id}`);
    }
}