<?php

namespace App\Core\Currency\Source\CoinApi;

use App\Core\HttpClient\Request;

class ExchangeRates extends Request
{
    /**
     * @return string
     */
    public function path(): string
    {
        $apiKey = config('http_client.coin_api.api_key');

        return "/v1/exchangerate/USD?apikey={$apiKey}&filter_asset_id=BTC,ETH";
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
        return ExchangeRatesResponse::class;
    }
}