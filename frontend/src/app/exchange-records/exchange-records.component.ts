import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'exchange-records',
  templateUrl: './exchange-records.component.html',
  styleUrls: ['./exchange-records.component.sass']
})
export class ExchangeRecordsComponent implements OnInit {

  constructor() { }

  @Input() exchangeRecords: Array<any>;

  ngOnInit() {
  }

}
