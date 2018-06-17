<?php

return [
    'apilayer' => [
        'base_url' => env('APILAYER_REPOSITORY_URL', 'http://127.0.0.1/?key=abc123&currency=%s'),
        'currencies' => explode('|', env('APILAYER_SUPPORTED_CURRENCIES', ''))
    ],
    'cryptocompare' => [
        'base_url' => env('CRYPTOCOMPARE_REPOSITORY_URL', 'http://127.0.0.1/?key=abc123&currency=%s'),
        'currencies' => explode('|', env('CRYPTOCOMPARE_SUPPORTED_CURRENCIES', ''))
    ],
];