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

// weather-properties.ts
import {
  faTint,
  faCompressArrowsAlt,
  faMountain,
  faWind,
  faAngleDoubleUp,
  faLocationArrow,
  faLocation
} from '@fortawesome/free-solid-svg-icons';
// import { WeatherAPIResponse } from '../../services/weather-property.model';
// import { map } from '@tomtom-international/web-sdk-maps';
import { faEllipsisH, faEllipsisV,faSearch } from '@fortawesome/free-solid-svg-icons';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
declare const bootstrap: any;





@Component({
  selector: 'app-weather',
  standalone: false,
  styleUrls: ['./weather.component.scss'],
  templateUrl: './weather.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class WeatherComponent implements OnInit {
  ellipsisH = faEllipsisH;
  ellipsisV = faEllipsisV;
  searchIcon = faSearch
  locationIcon = faLocation
  weatherProperties: any[] = [];
  city = '';
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
  theme: 'light' | 'dark' = 'light';

  faTint = faTint;
  faCompressArrowsAlt = faCompressArrowsAlt;
  faMountain = faMountain;
  faWind = faWind;
  faAngleDoubleUp = faAngleDoubleUp;
  faLocationArrow = faLocationArrow;

  suggestions: any[] = [];
  selectedPlace: any = null;
  @ViewChild('searchBox') searchBox!: ElementRef;
  private searchSubject = new Subject<string>();
  constructor(
    private bgService: BgService,
    private weatherService: LocationService
  ) {

  }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length > 2) {
          return this.weatherService.searchPlaces(query);
        } else {
          return []; // If the query is too short, return an empty array
        }
      })
    ).subscribe(data => {
      this.suggestions = data; // Update the suggestions array
      
    });
    this.localOffset = new Date().getTimezoneOffset() * 60000;
    this.searchByCity();
  }

  message = 'Weather data is currently unavailable for this area.';

  showToast(msg: string) {
    this.message = msg;
    
    
    const toastEl = document.getElementById('liveToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
  setThemeBasedOnTime(): void {
    this.theme = this.hour >= 6 && this.hour < 18 ? 'light' : 'dark';
    this.bgService.setTheme(this.theme);
  }

  mapData(data: any) {
    this.weatherProperties = [
      { label: 'Humidity', icon: this.faTint, units: '%', value: data.main.humidity },
      { label: 'Pressure', icon: this.faCompressArrowsAlt, units: 'hPa', value: data.main.pressure },
      { label: 'Ground Level', icon: this.faMountain, units: 'm', value: data.main.grnd_level },
      { label: 'Wind Speed', icon: this.faWind, units: 'm/s', value: data.wind.speed },
      { label: 'Wind Gust', icon: this.faAngleDoubleUp, units: 'm/s', value: data.wind.gust },
      { label: 'Wind Degree', icon: this.faLocationArrow, units: '°', value: data.wind.deg }
    ].filter(item => item.value !== undefined);


  }
  // getWindDirection(degree: number): string {
  //   const directions = [
  //     'N', 'NNE', 'NE', 'ENE',
  //     'E', 'ESE', 'SE', 'SSE',
  //     'S', 'SSW', 'SW', 'WSW',
  //     'W', 'WNW', 'NW', 'NNW'
  //   ];
  //   const index = Math.round(degree / 22.5) % 16;
  //   return directions[index];
  // }

  onSearchChange() {

    if (this.city.length > 2) {
      this.searchSubject.next(this.city);
    } else {
      this.suggestions = [];
    }
  }

  selectPlace(place: any) {
    this.selectedPlace = place;
    this.city = `${place.name}, ${place.country}`; // Update the city with selected place
    this.suggestions = []; 
    this.searchByCity()
  }

  searchByCity() {
    if (this.city.trim()) {
      this.weatherService.getWeatherByCity(this.city).subscribe(
        (data) => {
          this.suggestions = []
          this.weatherData = data;
          this.mapData(data)
          this.offset = this.weatherData.timezone;
          this.localTime = this.getLocalTime();
          this.locationError = '';
          this.startClock();
          // console.log(this.weatherData);
        },
        (error) => {
          this.locationError = 'City not found.';
          this.showToast(this.message);
          console.error('Error fetching city weather:', error);
        }
      );
    }
  }
  searchByPosition(lat: any, lon: any) {
    this.weatherService.getWeatherByCoords(lat, lon).subscribe(
      (data) => {
        this.suggestions = []

        this.weatherData = data;
        this.mapData(data)
        this.offset = this.weatherData.timezone;
        this.localTime = this.getLocalTime();
        this.startClock();
        this.locationError = '';
      },
      (error) => {
        // this.weatherData = null;
        this.showToast(this.message);
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
          this.showToast(this.message)
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
  getRelativeTime(unixSeconds: number): string {
    const target = new Date(unixSeconds * 1000);
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    const minutes = Math.floor(Math.abs(diff) / (1000 * 60)) % 60;
    const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));

    if (diff < -60000) return `${hours}h ${minutes}m ago`;
    if (diff > 60000) return `in ${hours}h ${minutes}m`;
    return 'now';
  }


  ngOnDestroy() {
    this.stopClock();
  }
}


