<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use App\Models\CurrencyConverter;

class CurrencyApiGateway extends Model
{
    const DEFAULT_CURRENCIES_AND_VALUES = [
        "USD" => 1,
        "BTC" => 0.00009682,
        "BRL" => 5.38,
        "ETH" => 0.002744,
        "EUR" => 0.8467
    ];

    const DEFAULT_CURRENCIES = [
        "USD",
        "BTC",
        "BRL",
        "ETH",
        "EUR"
    ];

    public function getSuportedCurrencies()
    {
        $currencyConverter = new CurrencyConverter();
        $currenciesInDatabase = $currencyConverter->getAllCurrencies();
    }

    public function getApiVaules(Array $currenciesArray)
    {
        if (empty($currenciesArray)) {
            return false;
        }

        $params = '';
        foreach ($currenciesArray as $currency) {
            $params .= $currency . ',';
        }
        $params = substr($params, 0, -1);

        $apiData = Http::get($this->getExternalApiUrl($params));

        if (!$apiData->successful()) {
            return false;
        }

        $apiData = json_decode($apiData->body());
        $responseArray = [];
        foreach ($apiData as $currency => $value) {
            $responseArray[$currency] = $value;
        }

        return $responseArray;

    }

    public function insertApiData($apiData, $hasAutomaticUpdate = false)
    {
        if (empty($apiData)) {
            return false;
        }

        $currencyConverter = new CurrencyConverter();

        return $currencyConverter->insertCurrenciesArray($apiData, $hasAutomaticUpdate);
    }

    public function insertOrUpdateCurrency($currency)
    {
        $currencyConverter = new CurrencyConverter();

        $apiData = $this->getApiVaules([$currency->currency]);

        if (isset($apiData["Response"])
            && $apiData["Response"] == 'Error') {
            $hasAutomaticUpdate = false;
            return $currencyConverter->insertOrUpdateCurrency($currency->currency, $currency->value, $hasAutomaticUpdate);
        }

        $hasAutomaticUpdate = true;
        foreach ($apiData as $apiCurrency => $apiValue) {
            return $currencyConverter->insertOrUpdateCurrency($apiCurrency, $apiValue, $hasAutomaticUpdate);
        }
    }

    private function getExternalApiUrl($params)
    {
        $baseUrl = env('EXT_API_URL', 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=');
        $apiKey = env('API_KEY', false);
        
        if (!$apiKey) {
            return false;
        }

        return $baseUrl . $params . "&api_key=" . $apiKey;
    }


}