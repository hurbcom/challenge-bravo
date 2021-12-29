import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {Currency} from "../../model/currency";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-currency-selector',
  styleUrls: ['./currency-selector.component.scss'],
  templateUrl: './currency-selector.component.html'
})
export class CurrencySelectorComponent implements OnInit {

  /** Event emitted when a currency is selected */
  @Output()
  onSelect = new EventEmitter<Currency>();

  /** Available currency list */
  currencies: Currency[] = [];

  /** Selected currency */
  selectedCurrency: any;

  /**
   * Class constructor
   * @param {DataService} dataService - Service that obtain data from bravo server
   * */
  constructor(private readonly dataService: DataService) {
  }

  ngOnInit(): void {
    // Obtain currency list at component start up
    this.dataService.getCurrencies().subscribe(value => this.currencies = value);
  }

  onCurrencySelect(): void {
    // Emit an event when a currency is selected
    this.onSelect.emit(this.selectedCurrency);
  }
}
