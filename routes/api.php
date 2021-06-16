<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\
{
    AuthController,
    UserController,
    CurrencyController,
    ConversionController,
    QuotationController
};

Route::group([
    'middleware' => 'apiJwt',
], function(){
});

Route::group([
    'middleware' => 'api',
], function ($router) {
    
    Route::get('/', function () {
        return ["status" => "osk"];
    });

    Route::get("conversion", [ConversionController::class,"conversion"]);
    Route::resources([
        'currencies' => CurrencyController::class,
        'users' => UserController::class,
        'quotations' => QuotationController::class,
    ]);
    
    Route::post('auth/login', [AuthController::class, 'login']);
});
