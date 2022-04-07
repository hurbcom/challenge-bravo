<?php

/** @var \Laravel\Lumen\Routing\Router $router */


use Illuminate\Support\Facades\Route;

$router->group(['prefix' => 'api/v1'], function () use ($router) {

    $router->get('/convert-currency-random/', 'Api\\v1\\CurrencyController@convertCurrencyRand');

    $router->get('/convert-currency/', [
        'as' => 'convert-currency', 'uses' => 'Api\\v1\\CurrencyController@convertCurrency'
    ]);
    $router->get('/currencies', 'Api\\v1\\CurrencyController@getCurrencies');
    $router->get('/currency/{id}', 'Api\\v1\\CurrencyController@getCurrency');
    $router->post('/currencies', 'Api\\v1\\CurrencyController@postCurrency');
    $router->patch('/currency/{id}', 'Api\\v1\\CurrencyController@updateCurrencyPrice');
    $router->delete('/currency/{id}', 'Api\\v1\\CurrencyController@deleteCurrency');
});

