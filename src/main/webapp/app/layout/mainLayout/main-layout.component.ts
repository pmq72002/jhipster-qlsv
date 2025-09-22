import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from 'app/core/auth/authService';
import { ViewModeService } from 'app/service/ViewModeService';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Component({
  selector: 'jhi-app',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
})
export default class MainLayoutComponent implements OnInit {
  isDropdown = false;
  handleIsDropdown(): void {
    this.isDropdown = !this.isDropdown;
  }
  constructor(
    private viewModeService: ViewModeService,
    private authService: AuthService,
  ) {}
  setViewMode(mode: 'info' | 'subject' | 'score') {
    this.viewModeService.setViewMode(mode);
  }

  logout() {
    this.authService.logout();
  }
  roles: string[] = [];
  stuCode: string = '';
  ngOnInit(): void {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles = JSON.parse(storedRoles);
      console.log('✅ Roles:', this.roles);
    }
    const token = localStorage.getItem('authenticationToken');
    if (token) {
      const payload: JwtPayload = jwtDecode(token);
      this.stuCode = payload.sub ?? '';
      console.log('stucode: ', this.stuCode);
    }
  }
}
