import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Weather } from '../model/weather';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private host = environment.apiUrl;
  public weatherList: Weather[][];

  constructor(private http: HttpClient) { }

  public getWeather(latitude: string, longitude: string, amountOfDays: string): Observable<Weather[][] | HttpErrorResponse> {
    return this.http.get<Weather[][]>(`${this.host}/weathercomparison?latitude=${latitude}&longitude=${longitude}&amountOfDays=${amountOfDays}`)
  }
  }

