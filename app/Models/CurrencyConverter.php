<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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

    public $amount;
    public $from;
    public $to;
    public $lastUpdate;

    public $errors;

    const CURRENCY_DOLLAR = 'USD';
    const CURRENCY_DATA_CACHE_KEY_PREFIX = 'currency_data_cache_key_';
    const AVALIABLE_CURRENCIES_CACHE_KEY = 'avaliable_currencies_cache_key';
    const DEFAULT_CACHE_TIME = 3600;
    
    const ERROR_UNSUPORTED_CURRENCY = 'Chosen currency not suported yet.';
    const ERROR_DUPLICATE_CURRENCY = 'Currency already registred in database.';
    const ERROR_INSERT_NEW_CURRENCY = 'Error creating new currency in database.';

    

    public function getConvertedValue($from, $to, $amount)
    {
        $this->amount = (float)$amount;
        $this->from = $from;
        $this->to = $to;

        if (!$this->hasRequestedCurrencies()) {
            return $this->formatErrorResponse(CurrencyConverter::ERROR_UNSUPORTED_CURRENCY);
        }

        $amountInDollar = $this->amount;

        if ($from != CurrencyConverter::CURRENCY_DOLLAR) {
            $amountInDollar = $this->convertValueinDollar($this->amount, $this->from);
        }

        if ($to == CurrencyConverter::CURRENCY_DOLLAR) {
            return $this->formatResponse($amountInDollar);
        }
        
        $convertedAmount = $this->convertValue($amountInDollar, $this->to);

        return $this->formatResponse($convertedAmount);
    }

    private function hasRequestedCurrencies()
    {
        $avaliableCurrencies = $this->getAvaliableCurrencies();

        if ( !in_array($this->from, $avaliableCurrencies) ) {
            $this->errors = $this->from;
            return false;
        }

        if ( !in_array($this->to, $avaliableCurrencies) ) {
            $this->errors = $this->to;
            return false;
        }

        return true;
    }

    public function getAvaliableCurrencies()
    {
        $avaliableCurrencies = Cache::get(CurrencyConverter::AVALIABLE_CURRENCIES_CACHE_KEY);

        if ($avaliableCurrencies) {
            return $avaliableCurrencies;
        }

        $avaliableCurrencies = CurrencyConverter::all();
        $avaliableCurrenciesArray = [];

        foreach ($avaliableCurrencies as $currency) {
            $avaliableCurrenciesArray[] = $currency->currency;
        }

        $this->putAvaliableCurrenciesInCache($avaliableCurrenciesArray);
        return $avaliableCurrenciesArray;
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

        $this->setLastUpdate($currencyValue);

        return $currencyValue->value;
    }

    private function getCurrencyValueFromDatabase($currency)
    {
        $currencyValue = CurrencyConverter::where('currency', $currency)->first();

        if (!$currencyValue) {
            return false;
        }

        $lastUpdate = $currencyValue->updated_at;

        if ($lastUpdate->isToday() || $currencyValue->hasAutomaticUpdate === false) {
            $this->putCurrencyInCache($currencyValue);
            return $currencyValue;
        }

        $apiGateway = new CurrencyApiGateway();

        $updatedCurrency = $apiGateway->insertOrUpdateCurrency($currencyValue);

        $this->putCurrencyInCache($updatedCurrency);
        return $updatedCurrency;
    }

    public function insertCurrenciesArray($apiData, $hasAutomaticUpdate = false)
    {
        if (empty($apiData)) {
            return false;
        }

        $currenciesArray = [];

        foreach ($apiData as $currency => $value) {
            $currenciesArray[] = $this->insertOrUpdateCurrency($currency, $value, $hasAutomaticUpdate);
        }

        return $currenciesArray;
    }

    public function insertOrUpdateCurrency($currency, $value, $hasAutomaticUpdate = false)
    {
        $newCurrency = CurrencyConverter::updateOrCreate(
            [
                'currency' => $currency,
                'value' => $value,
                'hasAutomaticUpdate' => $hasAutomaticUpdate,
            ]
        );

        return $newCurrency;
    }

    public function insertNewCurrency($currency,  $value)
    {
        $avaliableCurrencies = $this->getAvaliableCurrencies();

        if (in_array($currency, $avaliableCurrencies)) {
            return json_encode([
                'currency' => $currency,
                'value' => $value,
                'error' => CurrencyConverter::ERROR_DUPLICATE_CURRENCY,
            ]);
        }

        $newCurrency = new CurrencyConverter();
        $newCurrency->currency = $currency;
        $newCurrency->value = $value;

        $apiGateway = new CurrencyApiGateway();
        $updatedCurrency = $apiGateway->insertOrUpdateCurrency($newCurrency);

        if (!$updatedCurrency) {
            return json_encode([
                'currency' => $currency,
                'value' => $value,
                'error' => CurrencyConverter::ERROR_INSERT_NEW_CURRENCY,
            ]);
        }

        return json_encode([
            'currency' => $updatedCurrency->currency,
            'value' => $updatedCurrency->value,
            'hasAutomaticUpdate' => $updatedCurrency->hasAutomaticUpdate,
            'lastUpdate' => $updatedCurrency->updated_at->toDateTimeString()
        ]);
    }

    private function setLastUpdate($currency)
    {
        if (!$this->lastUpdate) {
            $this->lastUpdate = $currency->updated_at;
            return;
        }

        if ( $this->lastUpdate->greaterThan($currency->updated_at) ) {
            $this->lastUpdate = $currency->updated_at;
        }
    }

    public function putCurrencyInCache($currency)
    {
        Cache::put(CurrencyConverter::CURRENCY_DATA_CACHE_KEY_PREFIX . $currency, $currency, CurrencyConverter::DEFAULT_CACHE_TIME);
    }

    public function putAvaliableCurrenciesInCache($avaliableCurrencies)
    {
        Cache::put(CurrencyConverter::AVALIABLE_CURRENCIES_CACHE_KEY, $avaliableCurrencies, CurrencyConverter::DEFAULT_CACHE_TIME);
    }

    private function formatResponse($convertedAmount)
    {
        $convertedAmount = number_format($convertedAmount, 2, '.', '');

        return json_encode([
            'amount' => $this->amount,
            'from' => $this->from,
            'to' => $this->to,
            'convertedAmount' => $convertedAmount,
            'lastUpdate' => $this->lastUpdate->toDateTimeString()
        ]);
    }

    private function formatErrorResponse($error)
    {
        return json_encode([
            'amount' => $this->amount,
            'from' => $this->from,
            'to' => $this->to,
            'error' => $error . ' Param: ' . $this->errors
        ]);
    }
}
