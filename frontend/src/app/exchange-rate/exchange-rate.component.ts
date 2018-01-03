import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ExchangeRateService } from '../exchange-rate.service';


@Component({
  selector: 'exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.sass']
})
export class ExchangeRateComponent implements OnInit {

  exchange : any;
  currencies : Array<any>;

  @Output() convertedEvent = new EventEmitter<string>();

  constructor(private exchangeRateService : ExchangeRateService) {
  }

  ngOnInit() {
    this.exchange = {
      from : '',
      to : '',
      amount : 0,
      convertedAmount : null
    }
    //USD,BRL,EUR,BTC,ETH
    this.currencies = [
       {id: 'USD', name: "USD"},
       {id: 'EUR', name: "EUR"},
       {id: 'BRL', name: "BRL"},
       {id: 'BTC', name: "BTC"},
       {id: 'ETH', name: "ETH"}
     ];
  }

  getExchangeRate(){
    this.exchangeRateService.getExchangeRate(this.exchange.from, this.exchange.to, this.exchange.amount).subscribe( res => {
      this.exchange.convertedAmount = res.convertedAmount;
      this.convertedEvent.emit(this.exchange);
    });
  }
}
