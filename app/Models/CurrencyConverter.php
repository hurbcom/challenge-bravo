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

    const DEFAULT_CURRENCIES_AND_VALUES = [
        "USD" => 1,
        "BTC" => 0.00009682,
        "BRL" => 5.38,
        "ETH" => 0.002744,
        "EUR" => 0.8467
    ];

    const CURRENCY_DOLLAR = 'USD';
    const CURRENCY_DATA_CACHE_KEY_PREFIX = 'currency_data_cache_key_';
    const AVALIABLE_CURRENCIES_CACHE_KEY = 'avaliable_currencies_cache_key';
    const DEFAULT_CACHE_TIME = 3600;
    
    const ERROR_UNSUPORTED_CURRENCY = 'Chosen currency not suported yet.';
    const ERROR_DUPLICATE_CURRENCY = 'Currency already registred in database.';
    const ERROR_INSERT_NEW_CURRENCY = 'Error creating new currency in database.';
    const ERROR_CURRENCY_NOT_FOUND = 'Currency not found in database.';
    const ERROR_CURRENCY_NOT_DELETED = 'Error deleting currency.';
    const ERROR_UPDATE_CURRENCY = 'Error updating the currency in database.';

    public $amount;
    public $from;
    public $to;
    public $lastUpdate;

    public $errorParams = [];

    public function getConvertedValue(string $from, string $to, float $amount)
    {
        $this->amount = $amount;
        $this->from = $from;
        $this->to = $to;

        if (!$this->hasRequestedCurrency($this->from) || !$this->hasRequestedCurrency($this->to)) {
            return $this->formatConversionErrorResponse(CurrencyConverter::ERROR_UNSUPORTED_CURRENCY);
        }

        $amountInDollar = $this->amount;

        if ($from != CurrencyConverter::CURRENCY_DOLLAR) {
            $amountInDollar = $this->convertValueinDollar($this->amount, $this->from);
        }

        if ($to == CurrencyConverter::CURRENCY_DOLLAR) {
            return $this->formatConversionResponse($amountInDollar);
        }
        
        $convertedAmount = $this->convertValue($amountInDollar, $this->to);

        return $this->formatConversionResponse($convertedAmount);
    }

    private function hasRequestedCurrency(string $currency)
    {
        $avaliableCurrencies = $this->getAvaliableCurrencies();

        if (!in_array($currency, $avaliableCurrencies)) {
            $this->errorParams[] = $currency;
            return false;
        }

        return true;
    }

    public function getAvaliableCurrencies(bool $forceUpdate = false)
    {
        $avaliableCurrencies = Cache::get(CurrencyConverter::AVALIABLE_CURRENCIES_CACHE_KEY);

        if ($avaliableCurrencies && $forceUpdate === false) {
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

    private function convertValueinDollar(float $amount, string $from)
    {
        $destinyCurrencyValue = $this->getCurrencyValue($from);

        return $amount / $destinyCurrencyValue;
    }

    private function convertValue(float $amount, string $to)
    {
        $destinyCurrencyValue = $this->getCurrencyValue($to);

        return $amount * $destinyCurrencyValue;
    }

    private function getCurrencyValue(string $currency)
    {
        $currencyValue = Cache::get(CurrencyConverter::CURRENCY_DATA_CACHE_KEY_PREFIX . $currency);

        if (!$currencyValue) {
            $currencyValue = $this->getCurrencyValueFromDatabase($currency);
        }

        $this->setLastUpdate($currencyValue);

        return $currencyValue->value;
    }

    private function getCurrencyValueFromDatabase(string $currency)
    {
        $currencyObj = CurrencyConverter::where('currency', $currency)->first();

        $lastUpdate = $currencyObj->updated_at;

        if ($lastUpdate->isToday() || $currencyObj->hasAutomaticUpdate === false) {
            $this->putCurrencyInCache($currencyObj);
            return $currencyObj;
        }

        $apiGateway = new CurrencyApiGateway();
        $updatedCurrency = $apiGateway->getCurrencyUpdatedValue($currencyObj);
        $updatedCurrency->save();

        $this->putCurrencyInCache($updatedCurrency);
        return $updatedCurrency;
    }

    public function insertCurrency(string $currency, float $value)
    {
        $newCurrency = new CurrencyConverter();
        $newCurrency->currency = $currency;
        $newCurrency->value = $value;

        if ($this->hasRequestedCurrency($currency)) {
            return $this->formatInsertOrUpdateErrorResponse($newCurrency, CurrencyConverter::ERROR_DUPLICATE_CURRENCY);
        }

        $apiGateway = new CurrencyApiGateway();
        $updatedCurrency = $apiGateway->getCurrencyUpdatedValue($newCurrency);

        if (!$updatedCurrency->save()) {
            return $this->formatInsertOrUpdateErrorResponse($newCurrency, CurrencyConverter::ERROR_INSERT_NEW_CURRENCY);
        }

        $forceUpdate = true;
        $avaliableCurrencies = $this->getAvaliableCurrencies($forceUpdate);


        return $this->formatInsertOrUpdateResponse($updatedCurrency);
    }

    public function deleteCurrency(string $currency)
    {
        $currencyObj = CurrencyConverter::where('currency', $currency)->first();

        if (!$currencyObj) {
            return json_encode([
                'currency' => $currency,
                'error' => CurrencyConverter::ERROR_CURRENCY_NOT_FOUND,
            ]);
        }

        if (!$currencyObj->delete()) {
            return json_encode([
                'currency' => $currency,
                'error' => CurrencyConverter::ERROR_CURRENCY_NOT_DELETED,
            ]);
        }

        $forceUpdate = true;
        $avaliableCurrencies = $this->getAvaliableCurrencies($forceUpdate);
        $this->removeCurrencyFromCache($currency);
    
        return json_encode([
            'deletedCurrency' => $currency,
        ]);
    }

    public function updateCurrency(string $currency, float $value)
    {
        if (!$this->hasRequestedCurrency($currency)) {
            return json_encode([
                'currency' => $currency,
                'value' => $value,
                'error' => CurrencyConverter::ERROR_UNSUPORTED_CURRENCY,
            ]);
        }

        $currencyObj = CurrencyConverter::where('currency', $currency)->first();
        $currencyObj->value = $value;

        $apiGateway = new CurrencyApiGateway();
        $updatedCurrency = $apiGateway->getCurrencyUpdatedValue($currencyObj);

        if (!$updatedCurrency->save()) {
            return $this->formatInsertOrUpdateErrorResponse($updatedCurrency, CurrencyConverter::ERROR_UPDATE_CURRENCY);
        }

        $forceUpdate = true;
        $avaliableCurrencies = $this->getAvaliableCurrencies($forceUpdate);

        return $this->formatInsertOrUpdateResponse($updatedCurrency);
    }

    private function setLastUpdate(CurrencyConverter $currency)
    {
        if (!$this->lastUpdate) {
            $this->lastUpdate = $currency->updated_at;
            return;
        }

        if ($this->lastUpdate->greaterThan($currency->updated_at)) {
            $this->lastUpdate = $currency->updated_at;
        }
    }

    public function putCurrencyInCache(string $currency)
    {
        Cache::put(CurrencyConverter::CURRENCY_DATA_CACHE_KEY_PREFIX . $currency, $currency, CurrencyConverter::DEFAULT_CACHE_TIME);
    }

    public function removeCurrencyFromCache(string $currency)
    {
        Cache::forget(CurrencyConverter::CURRENCY_DATA_CACHE_KEY_PREFIX . $currency);
    }

    public function putAvaliableCurrenciesInCache(array $avaliableCurrencies)
    {
        Cache::put(CurrencyConverter::AVALIABLE_CURRENCIES_CACHE_KEY, $avaliableCurrencies, CurrencyConverter::DEFAULT_CACHE_TIME);
    }

    private function formatConversionResponse(float $convertedAmount)
    {
        $convertedAmount = number_format($convertedAmount, 2, '.', '');

        return json_encode([
            'amount' => $this->amount,
            'from' => $this->from,
            'to' => $this->to,
            'convertedAmount' => $convertedAmount,
            'lastUpdate' => $this->lastUpdate->toDateTimeString(),
            'errors' => $this->errorParams
        ]);
    }

    private function formatConversionErrorResponse(string $error)
    {
        return json_encode([
            'amount' => $this->amount,
            'from' => $this->from,
            'to' => $this->to,
            'errorMsg' => $error,
            'errorParams' => $this->errorParams
        ]);
    }

    private function formatInsertOrUpdateResponse(CurrencyConverter $currencyObj)
    {
        return json_encode([
            'currency' => $currencyObj->currency,
            'value' => $currencyObj->value,
            'hasAutomaticUpdate' => $currencyObj->hasAutomaticUpdate,
            'lastUpdate' => $currencyObj->updated_at->toDateTimeString(),
            'errors' => $this->errorParams
        ]);
    }

    private function formatInsertOrUpdateErrorResponse(CurrencyConverter $currencyObj, string $errorMsg)
    {
        return json_encode([
            'currency' => $currencyObj->currency,
            'value' => $currencyObj->value,
            'error' => $errorMsg,
        ]);
    }
}
