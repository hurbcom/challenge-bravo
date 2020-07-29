<?php

declare(strict_types=1);

namespace App\Handler;

use App\Service\ExchangeService;
use Mezzio\ProblemDetails\ProblemDetailsResponseFactory;
use Psr\Container\ContainerInterface;

class ExchangeHandlerFactory
{
    public function __invoke(ContainerInterface $container): ExchangeHandler
    {
        return new ExchangeHandler(
            $container->get(ExchangeService::class),
            $container->get(ProblemDetailsResponseFactory::class)
        );
    }
}
