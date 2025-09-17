import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  stuCode: string;
  password: string;
}

interface LoginResponse {
  code: number;
  result: {
    token: string;
    authenticated: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthJwtService {
  private apiUrl = 'http://localhost:8080/api/auth/log-in';
  constructor(private http: HttpClient) {}

  login(credentials: { stuCode: string; password: string; rememberMe: boolean }): Observable<LoginResponse> {
    const body: LoginRequest = {
      stuCode: credentials.stuCode,
      password: credentials.password,
    };
    return this.http.post<LoginResponse>(this.apiUrl, body);
  }
}
