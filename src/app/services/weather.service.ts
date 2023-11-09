import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) {}

  getWeatherDetails(city: string): Observable<any> {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual OpenWeatherMap API key
    const url = `${this.apiUrl}?q=${city}&appid=${apiKey}`;
    return this.http.get(url);
  }
}
