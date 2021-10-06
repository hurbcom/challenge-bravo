<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CurrencyController;

Route::prefix('v1')->group(function () {

    //Currency
    Route::get('currencies/convert-amount', [CurrencyController::class, 'convertAmount']);
    Route::apiResource('currencies', CurrencyController::class, ['except' => ['update']]);
});
