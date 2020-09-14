<?php

namespace App\Models;

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
        'currency', 'value', 'hasAutomaticUpdate', 'updated_at'
    ];

    protected $table = 'currency_converter';

    const CURRENCY_DOLLAR = 'USD';
    const CURRENCY_DATA_CACHE_KEY_PREFIX = 'currency_data_cache_key_';
    const LAST_UPDATE_CACHE_KEY = 'last_update_cache_key';
    const DEFAULT_CACHE_TIME = 3600;

    public function getConvertedValue($from, $to, $amount)
    {
        $this->amount = $amount;
        $this->from = $from;
        $this->to = $to;

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
        $currencyValue = Cache::get(CurrencyConverter::CURRENCY_DATA_CACHE_KEY_PREFIX . $currency);

        if (!$currencyValue) {
            $currencyValue = $this->getCurrencyValueFromDatabase($currency);
        }

        return $currencyValue->value;
    }

    private function getCurrencyValueFromDatabase($currency)
    {
        $currencyValue = CurrencyConverter::where('currency', $currency)->get();

        $lastUpdate = $currencyValue->updated_at->toDateString();

        if ($lastUpdate->isToday() || $currencyValue->hasAutomaticUpdate === false) {
            $this->putCurrencyInCache($currencyValue);
            return $currencyValue;
        }

        $apiGateway = new CurrencyApiGateway();

        $updatedCurrency = $apiGateway->updateCurrency($currencyValue);

        $this->putCurrencyInCache($updatedCurrency);
        return $updatedCurrency;
    }

    private function insertCurrenciesArray($apiData, $hasAutomaticUpdate = false)
    {
        if (empty($apiData)) {
            return false;
        }

        foreach ($apiData as $currency => $value) {
            CurrencyConverter::updateOrCreate(
                [
                    'currency' => $currency,
                    'value' => $value,
                    'hasAutomaticUpdate' => $hasAutomaticUpdate,
                ]
            );
        }
    }

    private function putCurrencyInCache($currency)
    {
        Cache::put(CurrencyConverter::CURRENCY_DATA_CACHE_KEY_PREFIX . $currency, CurrencyConverter::DEFAULT_CACHE_TIME);
    }

    private function formatResponse($convertedAmount)
    {
        return json_encode([
            'amount' => $this->amount,
            'from' => $this->from,
            'to' => $this->to,
            'convertedAmount' => $convertedAmount,
            'lastUpdate' => $this->lastUpdate
        ]);
    }
}
