<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->group(['prefix' => 'api'], function () use($router) {
    $router->get('/', function () use ($router) {
        return $router->app->version();
    });

    
});
