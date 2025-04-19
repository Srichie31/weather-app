import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface WeatherAPIResponse {
  main: {
    humidity: number;
    pressure: number;
    grnd_level?: number;
  };
  wind: {
    speed: number;
    gust?: number;
    deg: number;
  };
}