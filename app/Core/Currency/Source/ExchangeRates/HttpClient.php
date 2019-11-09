<?php

namespace App\Core\Currency\Source\ExchangeRates;

use App\Core\HttpClient\HttpClient as BaseHttpClient;

class HttpClient extends BaseHttpClient
{
    /**
     * HttpClient constructor.
     */
    public function __construct()
    {
        parent::__construct([
            'base_uri' => config('http_client.exchange_rates_api.url')
        ]);
    }
}