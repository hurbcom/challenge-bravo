<?php

declare(strict_types=1);

namespace App\Service;

use App\Mapper\CurrencyMapper;
use Psr\Container\ContainerInterface;

class CurrencyServiceFactory
{
    public function __invoke(ContainerInterface $container): CurrencyService
    {
        return new CurrencyService(
            $container->get(CurrencyMapper::class),
        );
    }
}
