import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'jhi-app',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export default class MainLayoutComponent {}
