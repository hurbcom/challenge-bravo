<?php

namespace Hurb\CurrencyConverter\Frameworks\Lumen;

use GuzzleHttp\Client as GuzzleClient;
use Hurb\CurrencyConverter\Converter;
use Hurb\CurrencyConverter\ConverterInterface;
use Hurb\CurrencyConverter\RateProviderCacheHandler;
use Hurb\CurrencyConverter\Repositories\RedisRepository;
use Hurb\CurrencyConverter\Repositories\RepositoryInterface;
use Hurb\CurrencyConverter\Providers\CryptoCompareRateProvider;
use Hurb\CurrencyConverter\Providers\ProviderInterface;
use Illuminate\Support\ServiceProvider;
use Predis\Client as RedisClient;

class CurrencyConverterServiceProvider extends ServiceProvider
{
    /**
     * Register all converter services and depencies.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(
            ProviderInterface::class,
            function () {
                return new CryptoCompareRateProvider(
                    new GuzzleClient()
                );
            }
        );

        $this->app->singleton(
            RepositoryInterface::class,
            function () {
                return new RedisRepository(
                    new RedisClient([
                        'host' => getenv('REDIS_HOST'),
                        'port' => getenv('REDIS_PORT'),
                        'password' => getenv('REDIS_PASSWORD'),
                        'database' => getenv('REDIS_DB')
                    ])
                );
            }
        );

        $this->app->singleton(
            ConverterInterface::class,
            function ($app) {
                return new Converter(
                    $app->make(RepositoryInterface::class)
                );
            }
        );
    }
}
