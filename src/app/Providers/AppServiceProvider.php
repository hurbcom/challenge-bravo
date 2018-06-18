<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->call([$this, 'processRegister']);
    }

    public function processRegister()
    {

        $this->app->bind('App\Repositories\RedisRateRepository', function () {

            $request = app(\Illuminate\Http\Request::class);
            $renewRedisCache = (bool) $request->input('force', 0);

            return new \App\Repositories\RedisRateRepository(
                app('App\Helpers\CacheClient'),
                app('App\Repositories\ApilayerRateRepository'),
                $renewRedisCache
            );
        });

        $this->app->bind('App\Repositories\ApilayerRateRepository', function () {
            return new \App\Repositories\ApilayerRateRepository(
                app('App\Helpers\HttpClient'),
                config('repositories.apilayer.base_url'),
                app('App\Repositories\CryptoCompareRateRepository'),
                config('repositories.apilayer.currencies')
            );
        });

        $this->app->bind('App\Repositories\CryptoCompareRateRepository', function () {
            return new \App\Repositories\CryptoCompareRateRepository(
                app('App\Helpers\HttpClient'),
                config('repositories.cryptocompare.base_url'),
                app('App\Repositories\NotFoundRateRepository'),
                config('repositories.cryptocompare.currencies')

            );
        });

        $this->app->bind('App\Repositories\NotFoundRateRepository', function () {
            return new \App\Repositories\NotFoundRateRepository();
        });

        $this->app->bind('App\Repositories\RateRepository','App\Repositories\RedisRateRepository');
    }
}
