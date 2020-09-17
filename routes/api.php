<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CurrencyConverterController;

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

Route::post('/', [CurrencyConverterController::class, 'create'])->name('create');

Route::put('/', [CurrencyConverterController::class, 'update'])->name('update');

Route::delete('/', [CurrencyConverterController::class, 'destroy'])->name('destroy');
