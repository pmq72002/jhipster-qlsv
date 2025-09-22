import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  private rolesKey = 'roles';

  constructor(private router: Router) {}

  setSession(token: string, roles: string[]) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.rolesKey, JSON.stringify(roles));
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

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.rolesKey);
    this.router.navigate(['/login']);
  }
}
