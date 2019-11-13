<?php

return [
    'default' => env('DB_CONNECTION'),
    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST'),
            'database' => env('DB_DATABASE'),
            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),
            'port' => env('DB_PORT', 3306),
        ],
        'mysql_testing' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST'),
            'database' => env('DB_TESTING_DATABASE'),
            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),
            'port' => env('DB_PORT', 3306),
        ],
    ],
    'migrations' => 'migrations',
];