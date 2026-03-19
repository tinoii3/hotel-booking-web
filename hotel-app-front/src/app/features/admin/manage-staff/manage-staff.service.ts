import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ManageStaffService {
    private baseUrl = `${environment.apiUrl}/manage-staff`;

    constructor(private http: HttpClient) { }

    getStaffs(
        page: number,
        limit: number,
        sortBy: string,
        sortOrder: string
    ): Observable<any> {
        const url = `${this.baseUrl}/staffs` +
            `?page${page}` +
            `&limit=${limit}` +
            `&sortBy=${sortBy}` +
            `&sortOrder=${sortOrder}`

        return this.http.get(url);
    }

    createStaff(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/staffs`, data);
    }

    updateStaff(id: number, data: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/staffs/${id}`, data);
    }

    deleteStaff(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/staffs/${id}`);
    }
}