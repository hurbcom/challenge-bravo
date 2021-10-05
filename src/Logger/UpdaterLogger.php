<?php

declare(strict_types=1);

namespace App\Logger;

use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;

class UpdaterLogger extends Logger
{
    public function __construct()
    {
        $handler = new StreamHandler(__DIR__ . '/../../storage/logs/updater.log');
        parent::__construct('updater', [$handler]);
    }
}
