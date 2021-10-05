<?php

/**
 * Map routes to controllers
 *
 * @var \League\Route\Router $router
 */

use App\Controller\ConverterController;
use App\Controller\CurrencyController;

// map a route
$router->get('/', [ConverterController::class, 'index']);
$router->get('/api/v1/converter', [ConverterController::class, 'index']);

// Currency control
$router->get('/api/v1/currencies', [CurrencyController::class, 'list']);
$router->get('/api/v1/currencies/{code}', [CurrencyController::class, 'get']);
$router->put('/api/v1/currencies/{code}', [CurrencyController::class, 'set']);
$router->delete('/api/v1/currencies/{code}', [CurrencyController::class, 'delete']);
