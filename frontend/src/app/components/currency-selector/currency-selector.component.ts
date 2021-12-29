import {Component, EventEmitter, forwardRef, OnInit, Output, ViewEncapsulation} from "@angular/core";
import {Currency} from "../../model/currency";
import {DataService} from "../../service/data.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-currency-selector',
  styleUrls: ['./currency-selector.component.scss'],
  templateUrl: './currency-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencySelectorComponent),
      multi: true,
    }]
})
export class CurrencySelectorComponent implements OnInit, ControlValueAccessor {

  @Output("onChange")
  onSelect = new EventEmitter<Currency>(); // Event emitted when a currency is selected

  /** Available currency list */
  currencies: Currency[] = [];

  /** Selected currency */
  selectedCurrency?: Currency;

  /** Change propagation method placeholder */
  private propagateChange = (_: any) => {
  };

  /**
   * Class constructor
   * @param {DataService} dataService - Service that obtain data from bravo server
   * */
  constructor(private readonly dataService: DataService) {
  }

  /**
   * Class initialization
   */
  ngOnInit(): void {
    // Obtain currency list at component start up
    this.dataService.getCurrencies().subscribe(value => this.currencies = value);
  }

  /**
   * Called when a currency is selected by the user
   */
  onChange(): void {
    // Propagate changes and emit an event when a currency is selected
    this.propagateChange(this.selectedCurrency);
    this.onSelect.emit(this.selectedCurrency);
  }

  /**
   * Receives ngModel values
   * @param {Currency} currency - Initial currency value
   */
  writeValue(currency?: Currency): void {
    this.selectedCurrency = currency;
  }

  /**
   * Register the function that propagates form changes
   * @param {any} fn - Function that propagates changes
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * Handle touch inputs. ControlValueAccessor method that won't be used.
   */
  registerOnTouched(): void {
  }

}
