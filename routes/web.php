<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/


$router->get('/', ['as' => 'welcome', 'uses' => 'WelcomeController@index']);
$router->post('/currency', ['as' => 'currency_create', 'uses' => 'CurrencyController@create']);
$router->delete('/currency/{id}', ['as' => 'currency_delete', 'uses' => 'CurrencyController@delete']);
$router->get('/currency/convert', ['as' => 'currency_convert', 'uses' => 'CurrencyController@convert']);
