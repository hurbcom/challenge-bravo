<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class HelperServiceProvider extends ServiceProvider
{
    /**
     * Register any helper services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('App\Helpers\RedisCacheClient', function () {
            return new \App\Helpers\RedisCacheClient(
                app('redis')
            );
        });

        $this->app->bind('App\Helpers\HttpClient','App\Helpers\GuzzleHttpClient');
        $this->app->bind('App\Helpers\CacheClient','App\Helpers\RedisCacheClient');
    }
}
