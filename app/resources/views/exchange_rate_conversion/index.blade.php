@extends('layouts.app')

@section('content')
<div class="container" ng-controller="exchangeRateCtrl">
    <div class="card">
        <h5 class="card-header bg-success text-white">
          Exchange Rate Conversion
        </h5>
        <div class="card-body">
            <div class="row align-items-center">
                <div class="col-md-12">
                    <div class="form-row">
                        <div class="col-6 col-md-3">
                            <div class="form-group">
                                <label>From</label>
                                <select class="form-control custom-select" ng-model="Currency.from" ng-change="disableCurrencyCode();">
                                    <option ng-repeat="currency in ListCurrencyCodes" value="@{{ currency.value }}" ng-disabled="currency.value !== 'all' ? false : true">@{{ currency.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="form-group">
                                <label>To</label>
                                <select class="form-control custom-select" ng-model="Currency.to" id='currency-to'>
                                    <option ng-repeat="currency in ListCurrencyCodes" value="@{{ currency.value }}" ng-disabled="currency.value !== Currency.from ? false : true">@{{ currency.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12 col-md-3">
                            <div class="form-group">
                                <label>Amount</label>
                                <input type="text" class="form-control" placeholder="1.00" ng-model="Currency.amount" mask-currency="''" config="{group:'.',decimal:',',indentation:' '}">
                            </div>
                        </div>
                        <div class="col-12 col-md-3 mt-auto">
                            <div class="form-group group-button">
                                <button class="btn btn-primary btn-block" ng-click="getExchangeRate();" ng-disabled="displayLoading === true">Convert</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-12" ng-show="Message !== ''">
                    <div class="alert alert-@{{Color}} alert-dismissible fade show text-center" role="alert">
                        @{{Message}}
                    </div>
                </div>
                <div class="col-12 text-center" ng-show="displayLoading === true">
                    <img src="images/loading.gif">
                </div>
                <div class="col-12 table-responsive" ng-show="ExchangeRates.length > 0">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Currency Code From-To</th>
                                <th class="text-center" scope="col">Converted Amount</th>
                                <th class="text-center" scope="col">Exchange Rate</th>
                                <th class="text-center" scope="col">Exchange Rate Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="exchangeRate in ExchangeRates">
                                <td>@{{exchangeRate['code']}}</td>
                                <td class="text-center">@{{exchangeRate['amount']}}</td>
                                <td class="text-center">@{{exchangeRate['rate']}}</td>
                                <td class="text-center">@{{exchangeRate['historical']}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection