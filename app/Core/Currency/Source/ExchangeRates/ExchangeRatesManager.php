<?php

namespace App\Core\Currency\Source\ExchangeRates;

use App\Core\Currency\Manager;
use App\Models\Currency;
use GuzzleHttp\Exception\GuzzleException;

class ExchangeRatesManager implements Manager
{
    const TYPE = 'exchange_rates';

    const CURRENCIES = [
        "CAD",
        "HKD",
        "ISK",
        "PHP",
        "DKK",
        "HUF",
        "CZK",
        "GBP",
        "RON",
        "SEK",
        "IDR",
        "INR",
        "BRL",
        "RUB",
        "HRK",
        "JPY",
        "THB",
        "CHF",
        "EUR",
        "MYR",
        "BGN",
        "TRY",
        "CNY",
        "NOK",
        "NZD",
        "ZAR",
        "USD",
        "MXN",
        "SGD",
        "AUD",
        "ILS",
        "KRW",
        "PLN",
        "USD"
    ];

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

    /**
     * @param Currency $currency
     * @return float
     * @throws GuzzleException
     */
    public function toBase(Currency $currency): float
    {
        /**
         * @var $response FindRatesResponse
         */
        $response = $this->client->do(new FindRates());

        return $response->getValue($currency->code);
    }
}