<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Container\ContainerInterface;
use Tuupola\Middleware\CorsMiddleware;

class CorsMiddlewareFactory
{
    public function __invoke(ContainerInterface $container): CorsMiddleware
    {
        $corsConfig = $container->get('config')['cors'] ?? [];

        return new CorsMiddleware($corsConfig);
    }
}
