<?php

namespace App\Core\Rules\Currency;

use App\Core\Currency\Source\CoinApi\CoinApiManager;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use Illuminate\Contracts\Validation\Rule;

class CurrencySupported implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return in_array($value, $this->currenciesAvailable());
    }

    /**
     * Get the validation error message.
     *
     * @return string|array
     */
    public function message()
    {
        return 'Currency not supported.';
    }

    /**
     * @return array
     */
    protected function currenciesAvailable(): array
    {
        return array_merge(
            ExchangeRatesManager::CURRENCIES,
            CoinApiManager::CURRENCIES
        );
    }
}