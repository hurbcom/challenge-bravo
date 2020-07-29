<?php

declare(strict_types=1);

// phpcs:disable
return [
    'cache' => [
        'api' => [
            'adapter' => [
                'name' => 'memory',
                'options' => [
                    'ttl' => 300,
                ],
            ],
            'plugins' => [
                'serializer',
                'exception_handler' => ['throw_exceptions' => false],
            ],
        ],
        'los_rate_limit' => [
            'adapter' => [
                'name' => 'memory',
                'options' => [
                    'ttl' => 300,
                ],
            ],
            'plugins' => [
                'serializer',
                'exception_handler' => ['throw_exceptions' => false],
            ],
        ],
    ],
];
// phpcs:enable
