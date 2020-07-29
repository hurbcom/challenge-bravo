<?php

declare(strict_types=1);

return [
    'mezzio-swoole' => [
        // Available in Swoole 4.1 and up; enables coroutine support
        // for most I/O operations:
        'enable_coroutine' => true,

        // Configure Swoole HTTP Server:
        'swoole-http-server' => [
            'host' => 'localhost',
            'port' => 8080,
            'mode' => SWOOLE_PROCESS, // SWOOLE_BASE or SWOOLE_PROCESS;
        ],
    ],
];
