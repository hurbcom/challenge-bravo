import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

 constructor() { }

 exchangeRecords: Array<any> = [];

  receiveConvertedMessage($event) {
    this.exchangeRecords.push({
      to : $event.to,
      from : $event.from,
      amount : $event.amount,
      convertedAmount : $event.convertedAmount
    });
  }
}
