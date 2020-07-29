<?php

declare(strict_types=1);

namespace App\Listener;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

use function extension_loaded;

class NewRelicListener
{
    public function __invoke(Throwable $error, Request $request, Response $response): void
    {
        if (! extension_loaded('newrelic')) {
            return;
        }

        newrelic_notice_error($error->getMessage(), $error);
    }
}
