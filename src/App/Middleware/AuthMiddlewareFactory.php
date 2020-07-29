<?php

declare(strict_types=1);

namespace App\Middleware;

use Mezzio\ProblemDetails\ProblemDetailsResponseFactory;
use Psr\Container\ContainerInterface;

class AuthMiddlewareFactory
{
    public function __invoke(ContainerInterface $container): AuthMiddleware
    {
        $apiKeys    = $container->get('config')['los']['api_server']['auth']['api-keys'] ?? [];
        $openRoutes = $container->get('config')['los']['api_server']['open-routes'] ?? [];

        return new AuthMiddleware($apiKeys, $openRoutes, $container->get(ProblemDetailsResponseFactory::class));
    }
}
