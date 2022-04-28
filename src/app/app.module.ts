import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherService } from './service/weather.service';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { SelectionComponent } from './selection/selection.component';


@NgModule({
  declarations: [
    AppComponent,
    SelectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotificationModule,
    FormsModule
  ],

  providers: [NotificationService, WeatherService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
