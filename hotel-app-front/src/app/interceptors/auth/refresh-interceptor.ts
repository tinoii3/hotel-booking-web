import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../core/services/token-service';
import { environment } from '../../../environments/environment';

import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import Swal from 'sweetalert2';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const http = inject(HttpClient);

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        tokenService.clearToken();
        return throwError(() => error);
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token) => {
            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });

            return next(cloned);
          }),
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return http
        .post<any>(`${environment.apiUrl}/auth/refresh`, { refresh_token: refreshToken })
        .pipe(
          switchMap((res) => {
            isRefreshing = false;

            tokenService.setToken(res.access_token, res.refresh_token);

            refreshTokenSubject.next(res.access_token);

            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.access_token}`,
              },
            });

            return next(cloned);
          }),

          catchError((err) => {
            isRefreshing = false;

            tokenService.clearToken();

            Swal.fire({
              icon: 'warning',
              title: 'Session หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
            });

            return throwError(() => err);
          }),
        );
    }),
  );
};
