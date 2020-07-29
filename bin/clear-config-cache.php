<?php

/**
 * @see       https://github.com/mezzio/mezzio-skeleton for the canonical source repository
 * @copyright https://github.com/mezzio/mezzio-skeleton/blob/master/COPYRIGHT.md
 * @license   https://github.com/mezzio/mezzio-skeleton/blob/master/LICENSE.md New BSD License
 */

declare(strict_types=1);

chdir(__DIR__ . '/../');

require 'vendor/autoload.php';

$config = include 'config/config.php';

if (! isset($config['config_cache_path'])) {
    echo "No configuration cache path found" . PHP_EOL;
    exit(0);
}

if (! file_exists($config['config_cache_path'])) {
    printf(
        "Configured config cache file '%s' not found%s",
        $config['config_cache_path'],
        PHP_EOL
    );
    exit(0);
}

if (false === unlink($config['config_cache_path'])) {
    printf(
        "Error removing config cache file '%s'%s",
        $config['config_cache_path'],
        PHP_EOL
    );
    exit(1);
}

printf(
    "Removed configured config cache file '%s'%s",
    $config['config_cache_path'],
    PHP_EOL
);
exit(0);
