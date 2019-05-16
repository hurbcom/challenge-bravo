<?php

return [

    'default' => env('CACHE_DRIVER'),

    'stores' => [

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

    ],

    'prefix' => '',
];
