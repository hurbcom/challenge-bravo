<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CurrenciesController;

Route::get('/', function () {
    return [
        "version" => "1.0.0",
        "description" => "Api to currencies conversion.",
        "author" => "Leonardo Neves <leo.mvhost@hotmail.com>"
    ];
})->name('main');

Route::prefix('currencies')->group(function() {
    Route::get('/', [CurrenciesController::class, 'listAll'])->name('currencies.all');
    Route::post('/', [CurrenciesController::class, 'newCurrency'])->name('currencies.all');
    Route::get('/convert', [CurrenciesController::class, 'convertCurrency'])->name('currencies.convert');
    Route::get('/{code}', [CurrenciesController::class, 'getByCode'])->name('currencies.getByCode');
    Route::delete('/{code}', [CurrenciesController::class, 'remove'])->name('currencies.remove');
});
