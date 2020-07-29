<?php

declare(strict_types=1);

use App\Middleware\CorsMiddlewareFactory;
use Tuupola\Middleware\CorsMiddleware;

return [
    'cors' => [
        'origin' => ['*'],
        'methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'headers.allow' => ['Origin', 'Authorization', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Api-Key'],
        'headers.expose' => [],
        'credentials' => true,
        'cache' => 86400,
    ],
    'dependencies' => [
        'factories' => [
            CorsMiddleware::class => CorsMiddlewareFactory::class,
        ],
    ],
];
