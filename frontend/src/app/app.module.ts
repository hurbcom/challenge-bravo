import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';

import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from 'primeng/inputnumber';
import {MessageService} from "primeng/api";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";

import {AppComponent} from './app.component';
import {CurrencyConverterComponent} from "./components/currency-converter/currency-converter.component";
import {CurrencyManagerComponent} from "./components/currency-manager/currency-manager.component";
import {CurrencySelectorComponent} from "./components/currency-selector/currency-selector.component";
import {AppRoutingModule} from "./app-routing.module";
import {InputTextModule} from "primeng/inputtext";

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
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    InputNumberModule,
    RippleModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
