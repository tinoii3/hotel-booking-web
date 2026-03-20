import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SKIP_ERROR_ALERT } from '../../interceptors/error/error-interceptor';

export interface UserProfile {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();

  private loaded = false;

  constructor(private http: HttpClient) {}

  loadProfile(): Observable<UserProfile | null> {
    if (this.loaded) {
      return of(this.userSubject.value);
    }

    return this.http
      .get<UserProfile>(`${this.apiUrl}/auth/user-profile`, {
        context: new HttpContext().set(SKIP_ERROR_ALERT, true),
      })
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
          this.loaded = true;
        }),
      );
  }

  setUser(user: UserProfile) {
    this.userSubject.next(user);
    this.loaded = true;
  }

  clearUser() {
    this.userSubject.next(null);
    this.loaded = false;
  }

  getSnapshot(): UserProfile | null {
    return this.userSubject.value;
  }
}
