import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {DataService} from "../../service/data.service";
import {InputNumber} from "primeng/inputnumber";
import {Currency} from "../../model/currency";
import {formatNumber} from "@angular/common";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-currency-converter',
  styleUrls: ['./currency-converter.component.scss'],
  templateUrl: './currency-converter.component.html',
})
export class CurrencyConverterComponent implements OnInit, AfterViewInit {

  @ViewChild('eamount')
  public amountInput!: InputNumber;

  amount = 10;
  from?: Currency;
  to?: Currency;
  resultLabel: string = "---"

  constructor(private readonly dataService: DataService) {
  }

  ngOnInit(): void {
    // Put the initial form values
    this.dataService.getCurrencies().subscribe(currencies => {
      this.from = currencies.find(curr => curr.code == 'BRL');
      this.to = currencies.find(curr => curr.code == 'USD');
      this.onChange({});
    });
  }


  public ngAfterViewInit(): void {
    // Adds type tel to input element to show numeric keyboard on mobile devices
    (this.amountInput.input.nativeElement as HTMLElement).setAttribute("type", "tel");
  }

  onChange(event: any): void {
    let amount = 'value' in event ? parseFloat(event.value) : this.amount;
    if (this.to === null || this.from === null) {
      return;
    }

    // @ts-ignore
    this.dataService.convert(amount, this.from, this.to).subscribe(response => {
      this.resultLabel = `${formatNumber(response.quote, "en-US", "1.2-5")} ${this.to?.code}`;
    });
  }

}
