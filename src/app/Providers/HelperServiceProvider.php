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
        $this->app->bind('App\Helpers\HttpClient','App\Helpers\GuzzleHttpClient');
    }
}
