<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExchangeHistoricalRateController;
use App\Http\Controllers\CurrencyCodeController;

/*
  |--------------------------------------------------------------------------
  | Web Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register web routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | contains the "web" middleware group. Now create something great!
  |
 */

Route::get( '/', [ExchangeHistoricalRateController::class, 'index'] );
Route::post( '/get-currency-code-rates', [ExchangeHistoricalRateController::class, 'getExchangeRatesByCurrencyCode'] );
Route::get( '/currency-code-list', [CurrencyCodeController::class, 'getListCurrencyCodes'] );
Route::get( '/currency-codes', [CurrencyCodeController::class, 'getCurrencyCodes'] );
Route::get( '/manage-currency-codes', [CurrencyCodeController::class, 'manageCurrencyCodes'] );


//Auth::routes();

//Route::get( '/home', [ App\Http\Controllers\HomeController::class, 'index' ] )->name( 'home' );