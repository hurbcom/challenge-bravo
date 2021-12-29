import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {Currency} from "./model/currency";
import {DataService} from "./service/data.service";
import {InputNumber} from "primeng/inputnumber";
import {formatNumber} from "@angular/common";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('eamount')
  public amountInput!: InputNumber;

  amount = 10;
  from?: Currency;
  to?: Currency;
  resultLabel: string = "---"

  constructor(private primengConfig: PrimeNGConfig, private readonly dataService: DataService) {
  }

  ngOnInit(): void {

    // Enable ripple effect globally
    this.primengConfig.ripple = true;

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
