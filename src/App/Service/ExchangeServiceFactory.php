<?php

declare(strict_types=1);

namespace App\Service;

use App\Mapper\CurrencyMapper;
use Laminas\Cache\StorageFactory;
use Psr\Container\ContainerInterface;

class ExchangeServiceFactory
{
    public function __invoke(ContainerInterface $container): ExchangeService
    {
        $config = $container->get('config');

        return new ExchangeService(
            $container->get(CurrencyMapper::class),
            StorageFactory::factory($config['cache']['api']),
            $container->get(ExternalApiService::class),
        );
    }
}
