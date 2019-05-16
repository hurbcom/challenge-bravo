<?php

namespace Hurb\CurrencyConverter\Providers;

interface ProviderInterface
{
    /**
     * Retrieve currencies to be used in the conversion.
     *
     * @return iterable
     */
    public function retrieve() : iterable;
}
