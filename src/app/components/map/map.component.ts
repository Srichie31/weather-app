import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';import * as tt from '@tomtom-international/web-sdk-maps';
import { environment } from '../../../../src/environments/environment';

@Component({
  selector: 'app-map',
  standalone:false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() lat: number | undefined;
  @Input() lon: number | undefined;

  map: any;
  marker: any;
  mapInitialized = false;
  @ViewChild('mapDiv', { static: true }) mapDiv!: ElementRef;

  ngAfterViewInit(): void {
    if (this.lat !== undefined && this.lon !== undefined) {
      this.initMap();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && this.lat !== undefined && this.lon !== undefined) {
      // Move the marker
      this.marker?.setLngLat([this.lon, this.lat]);

      // Fly the camera smoothly to the new location
      this.map.flyTo({
        center: [this.lon, this.lat],
        zoom: 10,
        speed: 1.2, // Lower = slower
        curve: 1.5, // Smooth curve
        essential: true
      });
    }
  }

  initMap() {
    this.map = tt.map({
      key: environment.tomTomKey,
      container: this.mapDiv.nativeElement,
      center: [this.lon!, this.lat!],
      zoom: 10
    });
    this.marker = new tt.Marker({ anchor: 'center' }).setLngLat([this.lon!, this.lat!]).addTo(this.map);
    
    // this.mapInitialized = true;
  }
}
