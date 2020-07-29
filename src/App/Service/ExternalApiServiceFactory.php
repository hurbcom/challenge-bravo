<?php

declare(strict_types=1);

namespace App\Service;

use Psr\Container\ContainerInterface;

class ExternalApiServiceFactory
{
    public function __invoke(ContainerInterface $container): ExternalApiService
    {
        $config = $container->get('config');

        return new ExternalApiService(
            $config['external_api']['base_uri'],
            $config['external_api']['password'] ?? null,
        );
    }
}
