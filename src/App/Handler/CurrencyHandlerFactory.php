<?php

declare(strict_types=1);

namespace App\Handler;

use App\Service\CurrencyService;
use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\ResourceGenerator;
use Mezzio\ProblemDetails\ProblemDetailsResponseFactory;
use Psr\Container\ContainerInterface;

class CurrencyHandlerFactory
{
    public function __invoke(ContainerInterface $container): CurrencyHandler
    {
        return new CurrencyHandler(
            $container->get(CurrencyService::class),
            $container->get(HalResponseFactory::class),
            $container->get(ResourceGenerator::class),
            $container->get(ProblemDetailsResponseFactory::class)
        );
    }
}
