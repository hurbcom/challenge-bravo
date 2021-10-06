<?php

namespace App\Providers;

use App\HttpClient\CurlHttpClient;
use App\HttpClient\HttpClientsInterface;
use Illuminate\Support\ServiceProvider;

class HttpClientServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            HttpClientsInterface::class,
            CurlHttpClient::class
        );
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
