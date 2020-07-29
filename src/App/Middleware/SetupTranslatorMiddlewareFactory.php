<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Container\ContainerInterface;

class SetupTranslatorMiddlewareFactory
{
    public function __invoke(ContainerInterface $container): SetupTranslatorMiddleware
    {
        return new SetupTranslatorMiddleware();
    }
}
