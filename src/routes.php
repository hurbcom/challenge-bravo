<?php

/**
 * Map routes to controllers
 *
 * @var \League\Route\Router $router
 */

use App\Controller\HelloWorld;

// map a route
$router->map('GET', '/', HelloWorld::class);
