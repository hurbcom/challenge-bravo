<?php

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


Route::post('/login', 'App\Http\Controllers\AuthController@login');
Route::post('/logout', 'App\Http\Controllers\AuthController@logout');

Route::group(['middleware' => 'auth:sanctum'], function () {

    /** Grupo de usuários */
    Route::group(['prefix' => 'users'], function () {
        Route::get('/', 'App\Http\Controllers\UserController@list');
        Route::get('/{user_id}', 'App\Http\Controllers\UserController@show');
        Route::post('/', 'App\Http\Controllers\UserController@store');
        Route::put('/{user_id}', 'App\Http\Controllers\UserController@update');
        Route::delete('/{user_id}', 'App\Http\Controllers\UserController@destroy');
    });

    /** Grupo Cotação */
    Route::group(['prefix' => 'cotacao'], function () {
        /** Cotação Ex: USD para BRL, USD para BTC, ETH para BRL, etc... */
        Route::get('/last', 'App\Http\Controllers\Awesame\ApiController@last');

        // daily / USD - BRL / 15
        Route::get('/daily', 'App\Http\Controllers\Awesame\ApiController@daily');
    });
});
