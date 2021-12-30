import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {DataService} from "../../service/data.service";
import {Currency} from "../../model/currency";
import {ConfirmationService, MessageService} from "primeng/api";
import {catchError, finalize, Observable, retry, tap, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-currency-manager',
  styleUrls: ['./currency-manager.component.scss'],
  templateUrl: './currency-manager.component.html',
  providers: [ConfirmationService]
})
export class CurrencyManagerComponent implements OnInit {

  /** Available currency list */
  currencies: Currency[] = [];

  /** Selected currencies */
  selectedCurrencies: Currency[] = [];

  /** New/Edit currency dialog visibility */
  currencyDialogVisible: boolean = false;

  /** New/Edit currency dialog type - true for new / false for edit */
  newCurrencyDialog: boolean = true;

  /** Currency at edition */
  currency: Currency = {code: "", name: "", rate: 0, type: "U"};

  /** Currency form */
  currencyForm!: FormGroup;

  /**
   * Class constructor
   * @param {DataService} dataService - Service that obtain data from bravo server
   * @param {ConfirmationService} confirmationService - Confirmation popup service
   * @param {MessageService} messageService - User notification service
   */
  constructor(private readonly dataService: DataService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  /**
   * Class initialization
   */
  ngOnInit(): void {

    // Load currency list
    this.loadCurrencyList()

    // Initialize validation rules
    this.currencyForm = new FormGroup({
        code: new FormControl(this.currency.code, [
          Validators.required,
          Validators.pattern(/[A-Z0-9*]*$/y)
        ]),
        name: new FormControl(this.currency.name, [
          Validators.required,
        ]),
        rate: new FormControl(this.currency.rate, [
          Validators.required,
          Validators.min(0.00001)
        ])
      }
    );
  }

  /** Get currency code (for model) */
  get code() {
    return this.currencyForm.get('code')!;
  }

  /** Get currency name (for model) */
  get name() {
    return this.currencyForm.get('name')!;
  }

  /** Get currency exchange rate (for model) */
  get rate() {
    return this.currencyForm.get('rate')!;
  }

  /**
   * Shows new currency dialog
   */
  newCurrency() {
    this.newCurrencyDialog = true;
    this.currency = {code: "", name: "", rate: 0, type: "U"};
    this.currencyForm.reset({
      code: this.currency.code,
      name: this.currency.name,
      rate: this.currency.rate
    });
    this.currencyDialogVisible = true;
  }

  /**
   * Shows edit currency dialog
   * @param {Currency} currency - Currency to be edited
   */
  editCurrency(currency: Currency) {
    this.newCurrencyDialog = false;
    this.currency = {...currency};
    this.currencyForm.patchValue({
      code: this.currency.code,
      name: this.currency.name,
      rate: this.currency.rate
    });
    this.currencyDialogVisible = true;
  }

  /**
   * Hide new/edit currency dialog
   */
  hideCurrencyDialog() {
    this.currencyDialogVisible = false;
  }

  /**
   * Save currency button dialog handler
   * @param {boolean} newCurrencyDialog - New (true) or Edit (false) behavior
   */
  saveCurrency(newCurrencyDialog: boolean) {

    const currency = {
      code: this.currencyForm.get('code')?.value,
      name: this.currencyForm.get('name')?.value,
      rate: this.currencyForm.get('rate')?.value
    };

    if (newCurrencyDialog) {
      // New Currency
      this.handleObservable(
        this.dataService.newCurrency(currency),
        `Currency ${currency.code} was successfully created.`,
        `Creating currency ${currency.code} resulted in an error.`,
        true
      );
    } else {
      // Edit Currency
      this.handleObservable(
        this.dataService.saveCurrency(currency),
        `Currency ${currency.code} was successfully saved.`,
        `Saving currency ${currency.code} resulted in an error.`,
        true
      );
    }
    this.currencyDialogVisible = false;
  }

  /**
   * Deletes a currency
   * @param {Currency} currency - Currency to be deleted
   */
  deleteCurrency(currency: Currency) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${currency.code}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.handleObservable(
          this.dataService.deleteCurrency(currency),
          `Currency ${currency.code} was successfully deleted.`,
          `Deletion of currency ${currency.code} resulted in an error.`,
          true
        );
      }
    });
  }

  /**
   * Handle webservice Observable responses
   * @param {Observable<any>} obs - Observable returned by webservice
   * @param {string} successMessage - Toast message showed on success
   * @param {string} errorMessage - Toast message showed on error
   * @param {boolean} reloadCurrencies - Refreshes or not a custom currencies list forcing a cache clean up
   */
  private handleObservable(obs: Observable<any>, successMessage: string, errorMessage: string, reloadCurrencies: boolean = false): void {
    obs.pipe(
      retry(1), // Retry once
      tap(err => console.error('Error:', JSON.stringify(err))), // Log error to console
      catchError((err: HttpErrorResponse) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage, life: 3000});
        return throwError(() => err);
      }),
      finalize(() => {
        if (reloadCurrencies) {
          this.loadCurrencyList()
        }
      })
    ).subscribe(() => {
      this.messageService.add({severity: 'success', summary: 'Successful', detail: successMessage, life: 3000});
    });
  }

  /**
   * Obtain a custom currency list from server, forcing a cache clean up
   */
  private loadCurrencyList() {
    this.dataService.clearCurrenciesCache();
    this.dataService.getCurrencies().subscribe(value => {
      this.currencies = value.filter(curr => curr.type === 'U');
    });
  }

}
