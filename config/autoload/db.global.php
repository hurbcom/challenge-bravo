<?php

declare(strict_types=1);

return [
    'db' => [
        'mysql' => [
            'driver' => 'Pdo_Mysql',
            'database' => getenv('MYSQL_DBNAME') ?: 'challenge_bravo',
            'username' => getenv('MYSQL_USER'),
            'password' => getenv('MYSQL_PASS'),
            'hostname' => getenv('MYSQL_HOST'),
            'port' => '3306',
            'charset' => 'UTF8',
        ],
    ],
];
