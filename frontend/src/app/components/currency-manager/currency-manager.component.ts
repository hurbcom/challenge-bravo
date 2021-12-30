import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {DataService} from "../../service/data.service";
import {Currency} from "../../model/currency";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-currency-manager',
  styleUrls: ['./currency-manager.component.scss'],
  templateUrl: './currency-manager.component.html',
})
export class CurrencyManagerComponent implements OnInit {

  /** Available currency list */
  currencies: Currency[] = [];

  /** selected currencies */
  selectedCurrencies: Currency[] = [];

  constructor(private readonly dataService: DataService) {
  }

  /**
   * Class initialization
   */
  ngOnInit(): void {
    // Obtain currency list at component start up and filter for the custom types
    this.dataService.getCurrencies().subscribe(value => {
      this.currencies = value.filter(curr => curr.type === 'U');
    });
  }


}
