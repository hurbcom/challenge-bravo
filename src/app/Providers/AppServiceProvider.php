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

        $this->app->bind('App\Repositories\RedisRateRepository', function () {
            return new \App\Repositories\RedisRateRepository(
                app('App\Helpers\CacheClient'),
                app('App\Repositories\ApilayerRateRepository')
            );
        });

        $this->app->bind('App\Repositories\ApilayerRateRepository', function () {
            return new \App\Repositories\ApilayerRateRepository(
                app('App\Helpers\HttpClient'),
                config('repositories.apilayer.base_url')
            );
        });

        $this->app->bind('App\Repositories\RateRepository','App\Repositories\RedisRateRepository');
    }
}
