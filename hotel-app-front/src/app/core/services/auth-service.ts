import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../features/auth/models/login-request';
import { LoginResponse } from '../../features/auth/models/login-response';
import { map, Observable, switchMap, tap } from 'rxjs';
import { RegisterRequest } from '../../features/auth/models/register-request';
import { RegisterResponse } from '../../features/auth/models/register-response';
import { TokenService } from './token-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap((res) => {
        this.tokenService.setToken(res.access_token, res.refresh_token);
      }),
      switchMap((res) => this.userService.loadProfile().pipe(map(() => res))),
    );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  logout() {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.tokenService.clearToken();
      return;
    }

    this.http
      .post(`${environment.apiUrl}/auth/logout`, {
        refresh_token: refreshToken,
      })
      .subscribe({
        complete: () => {
          this.tokenService.clearToken();
          this.userService.clearUser();
        },
        error: () => {
          this.tokenService.clearToken();
          this.userService.clearUser();
        },
      });
  }
}
