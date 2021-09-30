<?php

/**
 * Routing
 *
 * @var $router Router
 */

use App\Controller\HelloWorld;

// map a route
$router->map('GET', '/', HelloWorld::class);
