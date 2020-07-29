<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

use function extension_loaded;

class NewRelicMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandlerInterface $handler): Response
    {
        if (extension_loaded('newrelic')) {
            $this->detectTransactionName($request);
        }

        return $handler->handle($request);
    }

    private function detectTransactionName(Request $request): void
    {
        newrelic_name_transaction($request->getUri()->getPath() ?: '');
    }
}
