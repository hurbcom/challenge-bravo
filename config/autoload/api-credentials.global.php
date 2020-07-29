<?php

declare(strict_types=1);

return [
    'los' => [
        'api_server' => [
            'auth' => [
                'api-keys' => [
                    getenv('ADMIN_API_KEY') => [ // Admin
                        'allowed-routes' => ['*'],
                        'rate-limit' => [
                            'max_requests' => 10000, // 1000 / seconds
                            'reset_time' => 1,
                        ],
                    ],
                    getenv('CLIENTS_API_KEY') => [ // Clients
                        'allowed-routes' => [
                            'v1.exchange' => ['GET', 'HEAD', 'OPTIONS'],
                            'v1.currency.collection' => ['GET', 'HEAD', 'OPTIONS'],
                            'v1.currency.entity' => ['GET', 'HEAD', 'OPTIONS'],
                        ],
                        'rate-limit' => [
                            'max_requests' => 2000, // 2000 / seconds
                            'reset_time' => 1,
                        ],
                    ],
                ],
            ],
            'open-routes' => [ 'health' ],
        ],
    ],
    'external_api' => [
        'base_uri' => getenv('EXTERNAL_API_BASE_URI'),
        'password' => getenv('EXTERNAL_API_PASSWORD'),
    ],
];
