<?php
$router->get('/currency', 'CurrencyController@index');
$router->post('/currency/store', 'CurrencyController@store');
$router->delete('/currency/{name}/delete', 'CurrencyController@delete');
$router->put('/currency/{name}/update', 'CurrencyController@update');

$router->get('/exange', 'ExchangeRatesController@index');