<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

use Carbon\Carbon;

class CurrencyConverter extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'currency', 'value',
    ];

    protected $table = 'currency_converter';

    const CURRENCY_DOLLAR = 'USD';
    const CURRENCY_DATA_CACHE_KEY = 'currency_data_cache_key';
    const LAST_UPDATE_CACHE_KEY = 'last_update_cache_key';
    const DEFAULT_CACHE_TIME = 3600;

    public function getConvertedValue($from, $to, $amount)
    {
        $amountInDollar = $amount;

        if ($from != CurrencyConverter::CURRENCY_DOLLAR) {
            $amountInDollar = $this->convertValueinDollar($amount, $from);
        }

    
        if ($to == CurrencyConverter::CURRENCY_DOLLAR) {
            return $this->formatResponse($amountInDollar);
        }

        $convertedAmount = $this->convertValue($amountInDollar, $to);

        return $this->formatResponse($convertedAmount);
    }

    private function convertValueinDollar($amount, $from)
    {
        $destinyCurrencyValue = $this->getCurrencyValue($from);

        return $amount / $destinyCurrencyValue;
    }

    private function convertValue($amount, $to)
    {
        $destinyCurrencyValue = $this->getCurrencyValue($to);

        return $amount * $destinyCurrencyValue;
    }

    private function getCurrencyValue($currency)
    {
        $currencyValues = Cache::get(CurrencyConverter::CURRENCY_DATA_CACHE_KEY);

        if (!$currencyValues) {
            $currencyValues = $this->getCurrencyValuesFromDatabase();
            Cache::put(CurrencyConverter::CURRENCY_DATA_CACHE_KEY, $currencyValues, CurrencyConverter::DEFAULT_CACHE_TIME);
        }

        return $currencyValues[$currency];
    }

    private function getCurrencyValuesFromDatabase()
    {
        $this->refreshDatabase();

        $currencyValues = CurrencyConverter::all();
        $currencyValuesArray = [];

        foreach ($currencyValues as $currencyValue) {
            $currencyValuesArray[$currencyValue->currency] = $currencyValue->value;
        }

        return $currencyValuesArray;
    }

    private function refreshDatabase()
    {
        $lastUpdate = $this->getLastUpdate();
        $lastUpdateDate = Carbon::createFromFormat('Y-m-d', $lastUpdate);

        if ($lastUpdateDate->isToday()) {
            return true;
        }

        $apiDataJson = Http::get($this->getExternalApiUrl())->json();
        $dataArray = json_decode($apiDataJson, true);

        foreach ($dataArray['rates'] as $currency => $value) {
            CurrencyConverter::updateOrCreate(['currency' => $currency, 'value' => $value]);
        }

        Cache::put(CurrencyConverter::LAST_UPDATE_CACHE_KEY, $dataArray['date'], CurrencyConverter::DEFAULT_CACHE_TIME);
        Cache::put(CurrencyConverter::CURRENCY_DATA_CACHE_KEY, $dataArray['rates'], CurrencyConverter::DEFAULT_CACHE_TIME);

        return true;
    }

    private function getLastUpdate()
    {
        $lastUpdate = Cache::get(CurrencyConverter::LAST_UPDATE_CACHE_KEY);

        if (!$lastUpdate) {
            $lastUpdate = CurrencyConverter::select('updated_at')->first();
            Cache::put(CurrencyConverter::LAST_UPDATE_CACHE_KEY, $lastUpdate, CurrencyConverter::DEFAULT_CACHE_TIME);
        }

        return $lastUpdate->updated_at->toDateString();
    }

    private function getExternalApiUrl()
    {
        return env('EXT_API_URL', 'https://api.exchangeratesapi.io/latest?base=USD');
    }

    private function formatResponse($convertedAmount)
    {
        return json_encode([
            'convertedAmount' => $convertedAmount
        ]);
    }
}
