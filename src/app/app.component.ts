import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// import { WeatherDashboardComponent } from './weather-dashboard/weather-dashboard.component';

@Component({
  selector: 'app-root',
  // template: '<app-weather-dashboard></app-weather-dashboard>',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';
}
