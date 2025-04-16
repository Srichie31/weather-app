import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface WeatherProperty {
  prop: string;
  icon: IconDefinition;
  units: string;
  value: string | number;
}