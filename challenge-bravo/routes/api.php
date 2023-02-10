<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::get("/convert", [\App\Http\Controllers\CurrencyConversionController::class, 'convert']);

// CRUD na para as moedas
Route::get('/coin', [\App\Http\Controllers\CoinController::class, 'index']);
Route::post('/coin', [\App\Http\Controllers\CoinController::class, 'store']);
Route::post('/coin/{id}', [\App\Http\Controllers\CoinController::class, 'update']);
