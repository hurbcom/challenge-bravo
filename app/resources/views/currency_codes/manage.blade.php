@extends('layouts.app')

@section('content')
<div class="container" ng-controller="currencyCodesCtrl">
  <div class="card">
      <h5 class="card-header bg-success text-white">
        Manage Currency Codes
      </h5>
      <div class="row">
        <div class="col-7 col-xs-12">
          <div class="card-body">
            <div class="row mt-4">
                <div class="col-12" ng-show="Message !== ''">
                    <div class="alert alert-@{{Color}} alert-dismissible fade show text-center" role="alert">
                        @{{Message}}
                    </div>
                </div>
                <div class="col-12 text-center" ng-show="displayLoading === true">
                    <img src="images/loading.gif">
                </div>
                <div class="col-12 table-responsive" ng-show="CurrencyCodes.length > 0">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th class="text-center" scope="col">Code</th>
                                <th class="text-center" scope="col">Created</th>
                                <th class="text-center" scope="col">Updated</th>
                                <th class="text-center" scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="Code in CurrencyCodes">
                                <td class="text-center">@{{Code['code']}}</td>
                                <td class="text-center">@{{Code['created']}}</td>
                                <td class="text-center">@{{Code['updated']}}</td>
                                <td class="text-center">
                                  <div class="dropdown">
                                    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      Actions
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                      <a class="dropdown-item" data-currency="@{{Code['code']}}" data-toggle="modal" data-target="#removeConfirm" ng-show="Code['default'] !== 1">Delete</a>
                                      <a class="dropdown-item" data-currency="@{{Code['code']}}" ng-click="mountFormCurrencyRates();">Update</a>
                                    </div>
                                  </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
        <div class="col-5 col-xs-12 mt-4 mb-4">
          <h5 class="form-title pl-2">Enter New Currency Code</h5>
          <div class="text-center" ng-show="displayLoadingModal === true">
              <img src="images/Loader.gif" width="60px">
          </div>
          <div ng-show="displayLoadingModal === false" class="pl-2 pr-2">
            <form name="formCurrencyCode">
              <input type="hidden" name="csrf-token" value="{{ csrf_token() }}">
              <div class="form-group" ng-if="ChangeCurrencyCode == true && ExchangeRates.Code !== ''">
                <input type="hidden" class="form-control" ng-model="ExchangeRates.Code">
              </div>
              <div class="alert alert-info" role="alert" ng-if="ChangeCurrencyCode == false">
                If currency code is fictitious is necessary register exchange rates. After click check button, inform exchange rate values or leave to register default value 1.000000 to exchange rate.
              </div>
              <div class="input-group mb-3" ng-if="ChangeCurrencyCode == false">
                <input type="text" class="form-control text-uppercase" placeholder="Currency Code" ng-model="ExchangeRates.Code" ng-change="clearCheckCurrencyCode();">
                <div class="input-group-append">
                  <button type="button" ng-click="checkCurrencyCodeExists();" class="btn btn-outline-primary">Check Currency Code</button>
                </div>
              </div>
              <div class="row" ng-show="ExchangeRates.Rates.length > 0" ng-repeat="(key, ExchangeRate) in ExchangeRates.Rates">
                <div class="col-6">
                  @{{ExchangeRate.code}}
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <input type="text" maxlength="16" class="form-control" placeholder="1.000000" ng-model="ExchangeRate.rate" mask-currency="''" config="{group:'.',decimal:'.',indentation:' ', decimalSize:6}">
                  </div>
                </div>
              </div>
            </form>
            <div ng-show="ModalMessage !== ''">
                <div class="alert alert-@{{ModalMessageColor}} alert-dismissible fade show text-center" role="alert">
                    @{{ModalMessage}}
                </div>
            </div>
            <div class="float-right">
              <button type="button" class="btn btn-secondary" ng-click="cancelSaveCurrencyCode();">Cancel</button>
              <button type="button" ng-click="saveCurrencyCodeAndHistoricalRates();" class="btn btn-primary" ng-disabled="ExchangeRates.Code === ''">Save</button>
            </div>
          </div>
        </div>
      </div>
  </div>
  <div class="modal" tabindex="-1" role="dialog" id="removeConfirm">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure remove this currency code and exchange rates historical?</p>
          <form name="deleteCurrency">
            <input type="hidden" class="form-control delete-currency" value="">
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" ng-click="deleteCurrencyCodeAndHistoricalRates();">Confirm</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection