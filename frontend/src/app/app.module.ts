import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRecordsComponent } from './exchange-records/exchange-records.component';

@NgModule({
  declarations: [
    AppComponent,
    ExchangeRateComponent,
    ExchangeRecordsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ExchangeRateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
