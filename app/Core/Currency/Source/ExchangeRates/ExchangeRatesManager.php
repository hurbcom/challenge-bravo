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

        $value = $response->getValue($currency->code);

        return $amount / $value;
    }

    public function toFrom(Currency $to, float $baseCurrency): float
    {
        /**
         * @var $response FindRatesResponse
         */
        $response = $this->client->do(new FindRates());

        $value = $response->getValue($to->code);

        return $baseCurrency * $value;
    }
}