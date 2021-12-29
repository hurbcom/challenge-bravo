import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {Currency} from "./model/currency";
import {DataService} from "./service/data.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  amount = 10;
  from?: Currency;
  to?: Currency;

  constructor(private primengConfig: PrimeNGConfig, private readonly dataService: DataService) {
  }

  ngOnInit(): void {

    // Enable ripple effect globally
    this.primengConfig.ripple = true;

    // Put the initial form values
    this.dataService.getCurrencies().subscribe(currencies => {
      this.from = currencies.find(curr => curr.code == 'BRL')
      this.to = currencies.find(curr => curr.code == 'USD')
    });
  }
}
