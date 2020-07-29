<?php

declare(strict_types=1);

return [
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
