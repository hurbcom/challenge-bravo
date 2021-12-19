<?php

//use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExchangeHistoricalRateController;
use App\Http\Controllers\CurrencyCodeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::middleware( 'return-json:api' )->get( '/exchange-rates', [ExchangeHistoricalRateController::class, 'exchangeRateValues']);
Route::middleware( 'return-json:api' )->get( '/check-currency-code', [CurrencyCodeController::class, 'checkRealCurrencyCode']);
Route::middleware( 'return-json:api' )->delete( '/delete-currency-code/{code}', [CurrencyCodeController::class, 'deleteCurrencyCode']);
