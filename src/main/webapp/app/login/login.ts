import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthJwtService } from 'app/core/auth/auth-jwt.service';
import { AuthService } from 'app/core/auth/authService';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface jwtPayload {
  sub: string;
  scope?: string;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  stuCode: string = '';
  password: string = '';
  roles: string = '';
  error: string = '';
  showPassword: boolean = false;
  constructor(
    private authJwtService: AuthJwtService,
    private router: Router,
    private authService: AuthService,
  ) {}

  login() {
    this.authJwtService
      .login({
        stuCode: this.stuCode,
        password: this.password,
        rememberMe: false,
      })
      .subscribe({
        next: res => {
          const token = res.result.token;
          const decoded = jwtDecode<jwtPayload>(token);
          if (decoded.scope) {
            const roles = decoded.scope.split(' ');
            this.authService.setSession(token, roles);
          }

          localStorage.setItem('stuCode', this.stuCode);
          console.log('✅ Login success:', token);

          console.log('Decoded token: ', decoded);
          this.error = '';

          this.router.navigate(['/home']);
        },
        error: err => {
          console.error('❌ Login failed:', err);
          this.error = 'Sai mã sinh viên hoặc mật khẩu!';
        },
      });
  }
}
