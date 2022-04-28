import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Weather } from '../model/weather';
import { NotificationService } from '../service/notification.service';
import { WeatherService } from '../service/weather.service';

@Component({
  selector: 'app-login',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];
  public weatherList: Weather[][];
  public miniList: Weather[];
  public savedWeatherList: Weather[][];
  public miniSavedWeatherList: Weather[];
  safeSrc: SafeResourceUrl;
  public savedString: string;
  public latitude: string;
  public longitude: string;
  public submittedData: any;
  public currentDate: Date;
  public currentTemp: number;
  public currentPrecip: number;
  public submitted: boolean;

  constructor(private router: Router,
    private notificationService: NotificationService,
    private weatherService: WeatherService,
    private sanitizer: DomSanitizer) { }
    
  ngOnInit(): void {
    this.submitted = false;
    this.showSavedForecast();
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=59,%2022&amp;t=&amp;z=20&amp;ie=UTF8&amp;iwloc=B&amp&output=embed");  
    }

  public onSubmit(data): void {
    if (data.latitude > 90 || data.latitude < -90) {
      this.notificationService.notify( NotificationType.ERROR, "Enter a valid latitude (range -90 to 90)")
    } else if (data.longitude > 180 || data.longitude < -180) {
      this.notificationService.notify( NotificationType.ERROR, "Enter a valid latitude (Range -180 to 180)")
    } else if (data.amountOfDays < 1 || data.amountOfDays > 14) {
      this.notificationService.notify(NotificationType.ERROR, "Enter a valid amount of days (between 1 and 14)")
    } else { 
      this.submittedData = data;
            this.makeRequest(data, false);
    }
  }

  private makeRequest(data: any, saveToLocalStorage: boolean): void {
    this.weatherService.getWeather(data.latitude, data.longitude, data.amountOfDays).subscribe(
      (response: Weather[][]) => { 
        
         this.weatherList = response; 
         this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("http://maps.google.com/maps?q=" + data.latitude + "," + data.longitude + "&z=3&output=embed");
         this.miniList = this.weatherList[0];
         this.currentDate = this.weatherList[2][0].date;
         this.currentTemp = this.weatherList[2][0].temperature;
         this.currentTemp = this.weatherList[2][0].precipitation;
         if (saveToLocalStorage) {
              localStorage.setItem("Weatherlist", JSON.stringify(this.weatherList))
              this.showSavedForecast();
         }
         this.submitted = true;
         this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message)
      }
    );
  }

  public showSavedForecast(): void {
    this.savedString = "Your saved forecasts for location " + localStorage.getItem("Latitude") + "; " + localStorage.getItem("Longitude") + ":";
    this.savedWeatherList = JSON.parse(localStorage.getItem("Weatherlist"))
    this.miniSavedWeatherList = this.savedWeatherList[0];
  }

    public saveForecast(data: any): void {
      localStorage.clear();
      localStorage.setItem("Latitude", this.submittedData.latitude);
      localStorage.setItem("Longitude", this.submittedData.longitude);
      this.makeRequest(data, true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }
}
