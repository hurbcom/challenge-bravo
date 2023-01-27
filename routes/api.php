<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\ConvertController;

Route::get('convert/{from}/{to}/{amount}', [ConvertController::class, 'index']);
Route::get('supported', [ConvertController::class, 'currenciesSupported']);
Route::get('latest', [ConvertController::class, 'latestRates']);

Route::get('/currency', [CurrencyController::class, 'index']);
Route::post('/currency', [CurrencyController::class, 'store']);
Route::put('/currency/{id}', [CurrencyController::class, 'update']);
Route::delete('/currency/{id}', [CurrencyController::class, 'destroy']);

Route::fallback(function (){
    abort(404, 'API resource not found');
});
