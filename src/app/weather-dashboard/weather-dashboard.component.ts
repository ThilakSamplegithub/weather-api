import { Component,OnInit,OnDestroy,DoCheck,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserPreferencesService } from '../services/user-preferences.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-dashboard.component.html',
  styleUrl: './weather-dashboard.component.css'
})
export class WeatherDashboardComponent implements OnInit,OnDestroy, DoCheck, AfterViewInit {
  preferencesForm!: FormGroup;
  weatherDetails: any[] = []; // Declare and initialize the property
  updateIntervalSubscription: Subscription | undefined = undefined;
  constructor(private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute, private userPreferencesService: UserPreferencesService,private weatherService: WeatherService) {}
  // weather-dashboard.component.ts

  ngOnInit(): void {
    this.initForm();

    this.fetchWeatherData(); // Initial fetch

    // Fetch weather data based on the specified update interval
    this.updateIntervalSubscription = interval(this.preferencesForm.value.updateInterval * 60 * 1000)
      .subscribe(() => {
        this.fetchWeatherData();
      });
  }

// weather-dashboard.component.ts
fetchWeatherData(): void {
  const locations = this.userPreferencesService.getLocations();

  if (locations.length === 0) {
    const defaultLocation = this.userPreferencesService.getPreferences()?.defaultLocation || 'Hyderabad';
    this.weatherService.getWeatherDetails(defaultLocation).subscribe((data: any) => {
      this.displayWeatherData(defaultLocation, data);
    });
  } else {
    locations.forEach(location => {
      this.weatherService.getWeatherDetails(location).subscribe((data: any) => {
        this.displayWeatherData(location, data);
      });
    });
  }
}

displayWeatherData(location: string, data: any): void {
  const weatherDetails = this.weatherDetails || [];
  const index = weatherDetails.findIndex((item) => item.location === location);

  // Fetch the user's temperature unit preference
  const temperatureUnit = this.userPreferencesService.getPreferences()?.temperatureUnit || 'celsius';

  // Extract the temperature based on the unit preference
  const temperature = this.extractTemperature(data, temperatureUnit);

  if (index !== -1) {
    weatherDetails[index] = { location, temperature, otherDetails: data };
  } else {
    weatherDetails.push({ location, temperature, otherDetails: data });
  }

  this.weatherDetails = weatherDetails;
}
initForm(): void {
  // Existing code
  this.preferencesForm = this.formBuilder.group({
    defaultLocation: ['', Validators.required],
    temperatureUnit: ['Celsius', Validators.required],
    updateInterval: [30, Validators.required], // Default update interval is set to 30 minutes
    newLocation: '', // New input for adding locations
    locations: this.formBuilder.array([]),
  });

  const savedPreferences = this.userPreferencesService.getPreferences();
  if (savedPreferences) {
    this.preferencesForm.patchValue(savedPreferences);
  }
}

  savePreferences(): void {
    if (this.preferencesForm.valid) {
      this.preferencesForm.value.locations = Array.from(new Set(this.preferencesForm.value.locations));
      this.userPreferencesService.savePreferences(this.preferencesForm.value);
    }
  }
  
  
  // weather-dashboard.component.ts

extractTemperature(data: any, unit: string): string {
  // Implement logic to extract temperature based on the unit preference
  const temperature = data?.main?.temp; // Replace this with your actual API response structure

  if (unit === 'fahrenheit') {
    // Convert temperature to Fahrenheit if the unit is Fahrenheit
    return this.convertToFahrenheit(temperature).toFixed(2) + '°F';
  } else {
    // Display temperature in Celsius by default
    return temperature.toFixed(2) + '°C';
  }
}

convertToFahrenheit(celsius: number): number {
  // Conversion formula from Celsius to Fahrenheit
  return (celsius * 9 / 5) + 32;
}

  addNewLocation(): void {
    const newLocation = this.preferencesForm.get('newLocation')?.value;
  
    if (newLocation && !this.preferencesForm.value.locations.includes(newLocation)) {
      this.preferencesForm.value.locations.push(newLocation);
    }
  }

  ngDoCheck(): void {
    // Implement code to monitor changes in the data source and update weather data when changes are detected.
  }

  ngAfterViewInit(): void {
    // Implement code to start rendering the weather data and displaying it in the component.
  }

  ngOnDestroy(): void {
    if (this.updateIntervalSubscription) {
      this.updateIntervalSubscription.unsubscribe();
    }
  }
}
