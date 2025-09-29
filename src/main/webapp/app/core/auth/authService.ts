import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authenticationToken';
  private rolesKey = 'roles';
  private logoutTimer: any;

  constructor(private router: Router) {}

  setSession(token: string, roles: string[]) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.rolesKey, JSON.stringify(roles));
    sessionStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem(this.rolesKey, JSON.stringify(roles));
    this.startLogoutTimer(token);
  }

  private startLogoutTimer(token: string) {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp * 1000;
    const timeout = exp - Date.now();

    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    this.logoutTimer = setTimeout(() => {
      Swal.fire({
        icon: 'error',
        title: 'Hết hạn',
        html: `<b>Phiên đăng nhập đã kết thúc<br> Vui lòng đăng nhập lại<b></b>`,
        confirmButtonText: 'OK',
      });
      this.logout();
    }, timeout);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRoles(): string[] {
    const roles = localStorage.getItem(this.rolesKey);
    return roles ? JSON.parse(roles) : [];
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  public token: string | null = null;
  public roles: string[] = [];
  logout() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.rolesKey);
    sessionStorage.removeItem(this.rolesKey);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    this.router.navigate(['/login']);
  }
}
