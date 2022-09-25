<?php

namespace App\Adapter\Apis;

use App\Domain\Entity\BanckingCurrency\ExchangeRatePopulationApiComunication;
use App\Domain\Entity\BanckingCurrency\BanckingCurrencyEntity;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Http;

class ExchangeRatePopulationApiAdapter implements ExchangeRatePopulationApiComunication
{
    public function execute($currencyFrom): string|false
    {
        $banckingCurrency = new BanckingCurrencyEntity();

        $response = Http::get(
            'https://exchange-rates.abstractapi.com/v1/live/?api_key='
            . env('API_KEY_ABSTRACT_API') . '&base=' . $currencyFrom
            . '&target=' . $banckingCurrency->getIndentificantionName()
        );

        if ($response->status() !== 200 || empty($response->body())) {
            return false;
        }

        $body = json_decode($response->body());

        if (!isset($body->exchange_rates) && !isset($body->exchange_rates->USD)) {
            return false;
        }

        $persistData = $this->persistData($currencyFrom, $body->exchange_rates->USD);

        return $persistData;
    }

    public function persistData($indentificationName, $rate): string|false
    {
        $removeLastValue = Redis::command('DEL', [$indentificationName]);

        if ($removeLastValue === false) {
            return false;
        }

        $result = Redis::command('SET', [$indentificationName, $rate]);

        if ($result === false) {
            return false;
        }

        return 'success';
    }
}
