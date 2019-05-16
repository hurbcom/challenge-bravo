<?php

namespace Hurb\Api\Providers;

use Hurb\Converter\Converter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register api controller service.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(
            Converter::class,
            function ($app) {
                return new Converter();
            }
        );
    }
}
