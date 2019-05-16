<?php

namespace Hurb\CurrencyConverter\Frameworks\Lumen;

use Hurb\CurrencyConverter\RateProviderCacheHandler;
use Illuminate\Console\Command;

class RateProviderCacheCommand extends Command
{
    /**
     * Command signature to be invoked through artisan cli
     *
     * @var string
     */
    protected $signature = 'rate-provider:cache';

    /**
     * @var string
     */
    protected $description = 'Update currency rates in case of cache is expired';

    /**
     * Encapsulate the call for the RateProviderCacheHandler
     *
     * @param  RateProviderCacheHandler  $rateProviderCacheHandler
     * @return mixed
     */
    public function handle(RateProviderCacheHandler $rateProviderCacheHandler)
    {
        $rateProviderCacheHandler->handle();
    }
}
