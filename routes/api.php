<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InsertCurrencyController;
use App\Http\Controllers\ConverterController;
use App\Http\Controllers\ShowCurrenciesController;
use App\Http\Controllers\DeleteCurrencyController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/currency/create', [InsertCurrencyController::class, 'handle']);
Route::get('/currency/conversion', [ConverterController::class, 'handle']);
Route::get('/currency/show', [ShowCurrenciesController::class, 'handle']);
Route::delete('/currency/delete/{indentificationName}', [DeleteCurrencyController::class, 'handle']);
