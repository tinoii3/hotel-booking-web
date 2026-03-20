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

    getRoomTypes(): Observable<any> {
        return this.http.get(`${this.baseUrl}/room-types`);
    }

    getStaffName(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/manage-staff/staff-name`);
    }

    createRoom(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/rooms`, payload);
    }

    createRoomType(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/room-types`, payload);
    }

    updateRoom(id: number, payload: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}/rooms/${id}`, payload);
    }

    deleteRoom(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/rooms/${id}`);
    }

    deleteRoomType(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/room-types/${id}`);
    }

    uploadRoomImages(roomId: number, files: File[], coverIndex: number = -1): Observable<any> {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        formData.append('coverIndex', coverIndex.toString());
        return this.http.post(`${this.baseUrl}/rooms/${roomId}/images`, formData);
    }

    deleteRoomImage(imageId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/rooms/images/${imageId}`);
    }

    setCoverImage(roomId: number, imageId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/rooms/${roomId}/images/${imageId}/set-cover`, {});
    }
}