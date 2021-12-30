import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';

import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from 'primeng/inputnumber';
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";

import {AppComponent} from './app.component';
import {CurrencyConverterComponent} from "./components/currency-converter/currency-converter.component";
import {CurrencyManagerComponent} from "./components/currency-manager/currency-manager.component";
import {CurrencySelectorComponent} from "./components/currency-selector/currency-selector.component";
import {AppRoutingModule} from "./app-routing.module";
import {ToolbarModule} from "primeng/toolbar";

@NgModule({
  declarations: [
    AppComponent,
    CurrencyConverterComponent,
    CurrencyManagerComponent,
    CurrencySelectorComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    InputNumberModule,
    RippleModule,
    TableModule,
    ToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
