<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Version;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class VersionMiddleware implements MiddlewareInterface
{
    public const HEADER = 'X-Api-Version';

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        if ($response->hasHeader(self::HEADER)) {
            $response = $response->withoutHeader(self::HEADER);
        }

        return $response->withAddedHeader(self::HEADER, Version::VERSION);
    }
}
