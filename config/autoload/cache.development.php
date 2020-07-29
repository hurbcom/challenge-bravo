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
    // add log to stderr
    'loslog' => [
        'log_dir' => '',
        'error_logger_file' => 'php://stderr',
        'exception_logger_file' => 'php://stderr',
        'static_logger_file' => 'php://stderr',
        'http_logger_file' => 'php://stderr',
        'log_request' => false,
        'log_response' => false,
        'full' => false,
    ],
];
// phpcs:enable
