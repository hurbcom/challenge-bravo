<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Container\ContainerInterface;

class VersionMiddlewareFactory
{
    public function __invoke(ContainerInterface $container): VersionMiddleware
    {
        return new VersionMiddleware();
    }
}
