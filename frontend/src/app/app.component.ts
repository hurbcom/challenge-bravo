import {Component} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private primengConfig: PrimeNGConfig) {
  }

  ngOnInit(): void {
    // Enable ripple effect globally
    this.primengConfig.ripple = true;
  }

}
