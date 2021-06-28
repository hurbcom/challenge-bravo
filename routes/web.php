<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api'], function () use($router) {

    $router->group(['prefix' => 'currency'], function () use($router) {
        $router->get('conversion', 'MoedaController@currencyConverter');
        $router->get('', 'MoedaController@index');
        $router->get('{uid}', 'MoedaController@show');
        $router->post('', 'MoedaController@store');
        $router->patch('{uid}', 'MoedaController@update');
        $router->delete('{uid}', 'MoedaController@destroy');
    });

});
