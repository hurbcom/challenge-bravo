<?php

use Illuminate\Http\Request;

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
//converter
Route::get('converter', 'Api\ConverterCoinController@index')->name('converter.index');
Route::get('converter/coin', 'Api\ConverterCoinController@coin')->name('converter.index');
