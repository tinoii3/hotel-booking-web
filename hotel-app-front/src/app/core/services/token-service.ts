import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private ACCESS = 'access_token';
  private REFRESH = 'refresh_token';

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH);
  }

  setToken(access: string, refresh: string) {
    localStorage.setItem(this.ACCESS, access);
    localStorage.setItem(this.REFRESH, refresh);
  }

  clearToken() {
    localStorage.removeItem(this.ACCESS);
    localStorage.removeItem(this.REFRESH);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  decodeToken(): any {
    const token = this.getAccessToken();

    if (!token) {
      console.log('No access token found');
      return null;
    }

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    return decoded;
  }

  getUserRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.role ?? null;
  }
}
