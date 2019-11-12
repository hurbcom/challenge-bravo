<?php

namespace App\Core\Currency\Source\CoinApi;

use App\Core\Currency\Manager;
use App\Core\HttpClient\HttpClientException;
use App\Models\Currency;
use GuzzleHttp\Exception\GuzzleException;

class CoinApiManager implements Manager
{
    const TYPE = 'coin_api';

    const CURRENCIES = [
        "BTC",
        "ETH"
    ];

    /**
     * @var HttpClient
     */
    protected $client;

    /**
     * CoinLayerManager constructor.
     * @param HttpClient $client
     */
    public function __construct(HttpClient $client)
    {
        $this->client = $client;
    }

    /**
     * @param Currency $currency
     * @return float
     * @throws HttpClientException
     * @throws GuzzleException
     */
    public function toBase(Currency $currency): float
    {
        /**
         * @var $response ExchangeRatesResponse
         */
        $response = $this->client->do(new ExchangeRates());

        return $response->getValue($currency->code);
    }
}