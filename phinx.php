<?php

return
[
    'paths' => [
        'migrations' => '%%PHINX_CONFIG_DIR%%/db/migrations',
        'seeds' => '%%PHINX_CONFIG_DIR%%/db/seeds'
    ],
    'environments' => [
        'default_migration_table' => 'phinxlog',
        'default_environment' => 'production',
        'production' => [
            'adapter' => 'sqlite',
            'name' => './db/db',
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
