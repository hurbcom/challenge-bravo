<?php

declare(strict_types=1);

namespace App\Middleware;

use Laminas\Cache\Psr\SimpleCache\SimpleCacheDecorator;
use Laminas\Cache\StorageFactory;
use LosMiddleware\RateLimit\RateLimitMiddleware;
use LosMiddleware\RateLimit\RateLimitOptions;
use Mezzio\ProblemDetails\ProblemDetailsResponseFactory;
use Psr\Container\ContainerInterface;

use function array_key_exists;

class RateLimitMiddlewareFactory
{
    public function __invoke(ContainerInterface $container): RateLimitMiddleware
    {
        $config     = $container->get('config');
        $rateConfig = $config['los_rate_limit'] ?? [];
        $apiKeys    = $config['los']['api_server']['auth']['api-keys'];
        $rates      = [];
        foreach ($apiKeys as $key => $options) {
            if (! array_key_exists('rate-limit', $options)) {
                continue;
            }

            $rates[$key] = [
                'max_requests' => $options['rate-limit']['max_requests'],
                'reset_time' => $options['rate-limit']['reset_time'],
            ];
        }

        $rateConfig['keys'] = $rates;

        $config = $container->get('config')['cache']['los_rate_limit'];
        $cache  = StorageFactory::factory($config);

        return new RateLimitMiddleware(
            new SimpleCacheDecorator($cache),
            $container->get(ProblemDetailsResponseFactory::class),
            new RateLimitOptions($rateConfig)
        );
    }
}
