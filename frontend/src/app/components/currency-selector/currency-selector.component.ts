import {Component, Input, OnInit} from "@angular/core";
import {Currency} from "../../model/currency";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-currency-selector',
  styleUrls: ['./currency-selector.component.scss'],
  templateUrl: './currency-selector.component.html'
})
export class CurrencySelectorComponent implements OnInit {

  currencies: Currency[] = [];

  selectedCurrency: any;

  constructor(private readonly dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getCurrencies().subscribe(value => this.currencies =  value);
  }

}
