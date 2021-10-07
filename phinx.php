<?php

return
[
    'paths' => [
        'migrations' => __DIR__ . '/db/migrations',
        'seeds' => __DIR__ . '/db/seeds'
    ],
    'environments' => [
        'default_migration_table' => 'phinxlog',
        'default_environment' => 'production',
        'production' => [
            'adapter' => 'sqlite',
            'name' => './storage/db',
            'charset' => 'utf8',
        ],
        'testing' => [
            'adapter' => 'sqlite',
            'memory' => true,
            'charset' => 'utf8',
        ]
    ],
    'version_order' => 'creation'
];
