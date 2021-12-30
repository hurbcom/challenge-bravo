import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {CurrencyConverterComponent} from "./components/currency-converter/currency-converter.component";
import {CurrencyManagerComponent} from "./components/currency-manager/currency-manager.component";

const routes: Routes = [
  {path: '', component: CurrencyConverterComponent},
  {path: 'manage', component: CurrencyManagerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
