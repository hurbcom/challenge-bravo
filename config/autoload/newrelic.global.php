<?php

declare(strict_types=1);

use App\Listener\NewRelicListenerDelegatorFactory;
use Mezzio\ProblemDetails\ProblemDetailsMiddleware;

return [
    'dependencies' => [
        'delegators' => [
            ProblemDetailsMiddleware::class => [
                NewRelicListenerDelegatorFactory::class,
            ],
        ],
    ],
];
