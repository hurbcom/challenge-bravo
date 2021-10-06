<?php

namespace App\Providers;

use App\Repositories\Contracts\CurrencyRepositoryInterface;
use App\Repositories\CurrencyRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            CurrencyRepositoryInterface::class,
            CurrencyRepository::class
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
