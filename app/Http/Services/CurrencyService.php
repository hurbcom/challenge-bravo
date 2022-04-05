<?php

namespace App\Http\Services;

use App\Enums\CurrencyEnum;
use App\Models\Currency;
use Exception;
use Illuminate\Support\Carbon;

class CurrencyService
{
    /**
     * Converts Currency.
     * @param String $to
     * @param String $from
     * @param Float $amount
     *
     * @return array
     * @throws Exception
     */
    public function currencyConverter(String $to, String $from, Float $amount): array
    {
        $exchangedScope = $this->buildExchangedScope($to, $from, $amount);

        if($to != $from){
            $currencyTo = (new AwesomeApi())->getLastExchange($to);
            $currencyFrom = (new AwesomeApi())->getLastExchange($from);

            if($to == CurrencyEnum::BACKING_CURRENCY){

                if(empty($currencyFrom['code'])){
                    $currencyFrom = $this->getCurrencyByCodeIfExists($from);

                    if(empty($currencyFrom['code'])){
                        throw new Exception('Conversion currency not found.', 404);
                    }
                }

                $currencyTo['price'] = CurrencyEnum::BACKING_CURRENCY_PRICE;
                $currencyTo['created_at'] = $currencyFrom['created_at'];
                $exchangeRate = $this->tranformInCurrencyBacking($currencyFrom['price']);
            }
            elseif($from == CurrencyEnum::BACKING_CURRENCY){

                if(empty($currencyTo['code'])){
                    $currencyTo = $this->getCurrencyByCodeIfExists($to);

                    if(empty($currencyTo['code'])){
                        throw new Exception('Origin currency not found.', 404);
                    }
                }

                $currencyFrom['price'] = CurrencyEnum::BACKING_CURRENCY_PRICE;
                $currencyFrom['created_at'] = $currencyTo['created_at'];
                $exchangeRate = $currencyTo['price'];
            }
            else{

                if(empty($currencyFrom['code'])){
                    $currencyFrom = $this->getCurrencyByCodeIfExists($from);
                }

                if(empty($currencyTo['code'])){
                    $currencyTo = $this->getCurrencyByCodeIfExists($to);
                }

                if(empty($currencyTo['code']) || empty($currencyFrom['code'])){
                    throw new Exception('Currencies not found.', 404);
                }

                $exchangeRate = $this->tranformInExchangeRate($currencyTo, $currencyFrom);
            }

            $exchangedScope = $this->buildExchangedScope($to, $from, $amount, $exchangeRate, $currencyTo, $currencyFrom);
        }

        return $exchangedScope;
    }

    /**
     * Get currency if exists.
     * @param int $id
     * @ppram bool $allowsThrowException
     *
     * @throws Exception
     */
    public function getCurrencyIfExists(int $id, bool $allowsThrowException = true)
    {
        $currency = (new Currency())->findById($id);

        if(!$currency && $allowsThrowException){
            throw new Exception('Currency not found.', 404);
        }

        return $currency;
    }

    /**
     * Get currency if exists.
     * @param String $code
     */
    public function getCurrencyByCodeIfExists(String $code)
    {
        $currency = (new Currency())->findByCode($code);

        if(!is_null($currency)){
            $currency = $currency->toArray();
        }

        return $currency;
    }

    /**
     * Tranform In Currency Backing.
     * @param Float $price
     *
     * @return Float
     * @throws Exception
     */
    private function tranformInCurrencyBacking(Float $price): Float
    {
        return ($price == 0) ? $price : 1 / $price;
    }

    /**
     * Tranform In Exchange Rate.
     * @param array $currencyTo
     * @param array $currencyFrom
     *
     * @return Float
     * @throws Exception
     */
    private function tranformInExchangeRate(array $currencyTo, array $currencyFrom) : Float
    {
        if($currencyFrom['price'] == 0){
            throw new Exception('Conversion currency BID cannot be zero.', 404);
        }

        return $currencyTo['price'] / $currencyFrom['price'];
    }

    /**
     * Builds Exchanged Scope.
     * @param String $to
     * @param String $from
     * @param Float $amount
     * @param Float $exchangeRate
     * @param array $currencyTo
     * @param array $currencyFrom
     *
     * @return array
     */
    private function buildExchangedScope(String $to, String $from, Float $amount, Float $exchangeRate=1.0, array $currencyTo=[], array $currencyFrom=[]): array
    {
        $convertedAmount = $amount * $exchangeRate;

        return [
            'backingCurrency' => CurrencyEnum::BACKING_CURRENCY,
            'codeTo' => $to,
            'CodeFrom' => $from,
            'priceTo' => (!empty($currencyTo['price']) ? $currencyTo['price'] : ''),
            'priceFrom' => (!empty($currencyFrom['price']) ? $currencyFrom['price'] : ''),
            'exchangeRate' => $exchangeRate,
            'amount' => $amount,
            'convertedAmount' => $convertedAmount,
            'priceToDate' => (!empty($currencyTo['created_at']) ? $currencyTo['created_at'] : Carbon::now()),
            'priceFromDate' => (!empty($currencyFrom['created_at']) ? $currencyFrom['created_at'] : Carbon::now()),
        ];
    }
}
