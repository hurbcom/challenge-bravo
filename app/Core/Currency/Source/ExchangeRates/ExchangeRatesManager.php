<?php

namespace App\Core\Currency\Source\ExchangeRates;

use App\Core\Currency\Manager;
use App\Models\Currency;

class ExchangeRatesManager implements Manager
{
    const TYPE = 'exchange_rates';

    /**
     * @var HttpClient $client
     */
    protected $client;

    /**
     * ExchangeRatesManager constructor.
     * @param HttpClient $client
     */
    public function __construct(HttpClient $client)
    {
        $this->client = $client;
    }

    public function toBase(Currency $currency, float $amount): float
    {
        /**
         * @var $response FindRatesResponse
         */
        $response = $this->client->do(new FindRates());

        return $response->getValue($currency->code);
    }

    public function toFrom(Currency $to, float $baseCurrency): float
    {
        /**
         * @var $response FindRatesResponse
         */
        $response = $this->client->do(new FindRates());

        return $response->getValue($to->code);
    }
}