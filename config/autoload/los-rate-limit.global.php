<?php

declare(strict_types=1);

use App\Middleware\RateLimitMiddlewareFactory;
use LosMiddleware\RateLimit\RateLimitMiddleware;

return [
    'los_rate_limit' => [
        'max_requests' => 10000,
        'reset_time' => 3600,
        'ip_max_requests' => 10,
        'ip_reset_time' => 3600,
        'api_header' => 'X-Api-Key',
        'trust_forwarded' => false,
    ],
    'dependencies' => [
        'factories' => [
            RateLimitMiddleware::class => RateLimitMiddlewareFactory::class,
        ],
    ],
];
