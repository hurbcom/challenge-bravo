<?php

declare(strict_types=1);

use App\Handler\CurrencyHandler;
use App\Handler\ExchangeHandler;
use LosMiddleware\RateLimit\RateLimitMiddleware;
use Mezzio\Application;
use Mezzio\MiddlewareFactory;
use Psr\Container\ContainerInterface;

return static function (Application $app, MiddlewareFactory $factory, ContainerInterface $container): void {
    $app->get('/health', App\Handler\HealthHandler::class, 'health');
    $app->route(
        '/v1/exchange/{from}/{to}/{amount}',
        [RateLimitMiddleware::class, ExchangeHandler::class],
        ['GET', 'OPTIONS'],
        'v1.exchange'
    );
    $app->route(
        '/v1/currency/{id}',
        [RateLimitMiddleware::class, CurrencyHandler::class],
        ['GET', 'DELETE', 'OPTIONS'],
        'v1.currency.entity'
    );
    $app->route(
        '/v1/currency',
        [RateLimitMiddleware::class, CurrencyHandler::class],
        ['GET', 'POST', 'DELETE', 'OPTIONS'],
        'v1.currency.collection'
    );
};
