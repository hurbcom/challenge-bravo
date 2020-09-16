<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use App\Models\CurrencyConverter;

class CurrencyApiGateway extends Model
{
    public function updateCurrencyWithApi(CurrencyConverter $currency)
    {
        $apiData = Http::get($this->getExternalApiUrl($currency->currency));
        $currency->hasAutomaticUpdate = false;

        if (!$apiData->successful()) {
            $currency->errorParams[] = 'Error in get up to date data.';
            return $currency;
        }

        if (isset($apiData["Response"]) && $apiData["Response"] == 'Error') {
            $currency->errorParams[] = 'Error in get up to date data.';
            return $currency;
        }


        $apiData = json_decode($apiData->body());
        $responseArray = [];
        foreach ($apiData as $cur => $value) {
            $currency->value = $value;
        }

        $currency->hasAutomaticUpdate = true;

        return $currency;
    }

    public function getCurrencyUpdatedValue(CurrencyConverter $currency)
    {
        $updatedCurrency = $this->updateCurrencyWithApi($currency);

        return $updatedCurrency;
    }

    private function getExternalApiUrl(string $param)
    {
        $baseUrl = env('EXT_API_URL', 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=');
        $apiKey = env('API_KEY', false);
        
        if (!$apiKey) {
            return false;
        }

        return $baseUrl . $param . "&api_key=" . $apiKey;
    }
}
