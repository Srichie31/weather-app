import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiKey = environment.openWeatherKey;
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeatherByCity(city: string) {
    const url = `${this.baseUrl}?q=${city}&units=metric&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getWeatherByCoords(lat: number, lon: number) {
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  searchCities(query: string): Observable<any> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`;
    return this.http.get(url);
  }
}
