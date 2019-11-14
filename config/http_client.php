<?php

return [
    'exchange_rates' => [
        'url' => env('HTTP_CLIENT_EXCHANGE_RATES_URL'),
    ],
    'coin_api' => [
        'url' => env('HTTP_CLIENT_COIN_API_URL'),
        'api_key' => env('HTTP_CLIENT_COIN_API_KEY'),
    ]
];