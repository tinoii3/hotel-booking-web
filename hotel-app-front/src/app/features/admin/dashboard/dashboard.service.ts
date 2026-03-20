import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`; 

  getDashboardSummary(month?: string, year?: string): Observable<any> {
    let params = new HttpParams();
    
    if (month && year) {
      params = params.set('month', month).set('year', year);
    }

    return this.http.get(`${this.apiUrl}/summary`, { params });
  }
}