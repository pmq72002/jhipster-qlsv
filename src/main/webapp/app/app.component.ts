import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import HomeComponent from './home/home.component';
import { LoginComponent } from './login/login';

@Component({
  selector: 'jhi-app',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, LoginComponent],
})
export default class AppComponent {}
