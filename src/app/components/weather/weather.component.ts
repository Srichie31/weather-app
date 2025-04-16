import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';
import { LocationService } from '../../services/location.service';
import { BgService } from '../../services/bg.service';

@Component({
  selector: 'app-weather',
  standalone: false,
  styleUrls: ['./weather.component.scss'],
  templateUrl: './weather.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class WeatherComponent implements OnInit {
  city = 'goa';
  weatherData: any;
  coords: { lat: number; lon: number } | null = null;
  rise: any;
  set: any;
  locationError: string = '';
  localTime: string = '';
  countryDate: any = '';
  offset: any = '';
  countryTime: any;
  hour: any;
  intervalId: any;
  remoteTime: any = {
    sunrise: '',
    sunset: '',
  };
  localOffset: any;
  suggestions: any[] = [];
  theme: 'light' | 'dark' = 'light';

  hourlyData = [
    { time: '12:00', icon: 'wi wi-day-sunny', temp: 28 },
    { time: '13:00', icon: 'wi wi-day-cloudy', temp: 29 },
    { time: '14:00', icon: 'wi wi-cloud', temp: 27 },
    { time: '15:00', icon: 'wi wi-rain', temp: 25 },
    { time: '16:00', icon: 'wi wi-thunderstorm', temp: 24 },
    { time: '17:00', icon: 'wi wi-night-clear', temp: 22 },
  ];
  

  @ViewChild('searchBox') searchBox!: ElementRef;

  constructor(
    private bgService: BgService,
    private weatherService: LocationService
  ) {}

  ngOnInit(): void {
    this.localOffset = new Date().getTimezoneOffset() * 60000;
    this.searchByCity();
  }
  setThemeBasedOnTime(): void {
    this.theme = this.hour >= 6 && this.hour < 18 ? 'light' : 'dark';
    this.bgService.setTheme(this.theme);
  }

  searchByCity() {
    if (this.city.trim()) {
      this.weatherService.getWeatherByCity(this.city).subscribe(
        (data) => {
          this.weatherData = data;
          this.offset = this.weatherData.timezone;
          this.localTime = this.getLocalTime();
          this.locationError = '';
          this.startClock();
          console.log(this.weatherData);
        },
        (error) => {
          this.weatherData = null;
          this.locationError = 'City not found.';
          console.error('Error fetching city weather:', error);
        }
      );
    }
  }
  searchByPosition(lat: any, lon: any) {
    this.weatherService.getWeatherByCoords(lat, lon).subscribe(
      (data) => {
        this.weatherData = data;
        this.offset = this.weatherData.timezone;
        this.localTime = this.getLocalTime();
        this.startClock();
        this.locationError = '';
      },
      (error) => {
        this.weatherData = null;
        this.locationError = 'Unable to fetch weather for your location.';
        console.error('Error fetching geo weather:', error);
      }
    );
  }

  useMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.searchByPosition(lat, lon);
        },
        (error) => {
          this.weatherData = null;
          this.locationError = 'Location access denied or unavailable.';
          console.error('Geolocation error:', error);
        }
      );
    } else {
      this.locationError = 'Geolocation is not supported by this browser.';
    }
  }
  getStyleForMessage(message: string): { [key: string]: string } {
    switch (message.toLowerCase()) {
      case 'clear':
        return { backgroundColor: '#cceeff', color: '#003366' };
      case 'rain':
        return { backgroundColor: '#4f5960', color: '#ffffff' };
      case 'thunderstorm':
        return { backgroundColor: '#222222', color: '#ffcc00' };
      case 'snow':
        return { backgroundColor: '#ffffff', color: '#000000' };
      default:
        return { backgroundColor: '#eeeeee', color: '#333333' };
    }
  }

  getLocalTime(): string {
    const curOffset = new Date().getTimezoneOffset() * 60000;
    const utc = new Date().getTime() + curOffset;
    const localTime = new Date(utc + this.offset * 1000);
    this.bgService.setBackGround(localTime.getHours());
    this.hour = localTime.getHours()
    // this.remoteTime.sunrise = this.formatUnixTime(this.weatherData.sys.sunrise, this.weatherData.timezone);
    // this.remoteTime.sunset = this.formatUnixTime(this.weatherData.sys.sunset, this.weatherData.timezone);

    return localTime.toLocaleTimeString();
  }

  startClock() {
    if (this.intervalId) this.stopClock();
    this.updateTime(); // initial render
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  stopClock() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  updateTime() {
    this.setThemeBasedOnTime()      
    const nowUTC = new Date(
      Date.now() + new Date().getTimezoneOffset() * 60000
    );
    const localTime = new Date(nowUTC.getTime() + this.offset * 1000);

    this.countryTime = localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    this.countryDate = localTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }

  ngOnDestroy() {
    this.stopClock();
  }
}
