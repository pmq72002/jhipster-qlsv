import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import HomeComponent from './home/home.component';

@Component({
  selector: 'jhi-app',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, HomeComponent],
})
export default class AppComponent {}
