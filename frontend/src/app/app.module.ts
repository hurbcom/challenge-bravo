import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from 'primeng/inputnumber';

import {AppComponent} from './app.component';
import {CurrencySelectorComponent} from "./components/currency-selector/currency-selector.component";
import {HttpClientModule} from "@angular/common/http";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

@NgModule({
  declarations: [
    AppComponent,
    CurrencySelectorComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    InputNumberModule,
    ButtonModule,
    RippleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
