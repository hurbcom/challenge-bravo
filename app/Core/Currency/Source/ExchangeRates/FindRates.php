<?php

namespace App\Core\Currency\Source\ExchangeRates;

use App\Core\HttpClient\Request;

class FindRates extends Request
{
    /**
     * @return string
     */
    public function path(): string
    {
        return '/latest?base=USD';
    }

    /**
     * @return array
     */
    protected function body(): array
    {
        return [];
    }

    /**
     * @return string
     */
    public function method(): string
    {
        return 'GET';
    }

    /**
     * @return string
     */
    public function responseClass(): string
    {
        return FindRatesResponse::class;
    }

    /**
     * @return bool
     */
    public function cached(): bool
    {
        return true;
    }
}