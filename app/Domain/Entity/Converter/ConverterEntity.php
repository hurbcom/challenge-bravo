<?php

namespace App\Domain\Entity\Converter;

use App\Domain\Entity\Currency\CurrencyEntity;

class ConverterEntity
{
    protected $currencyFrom;
    protected $currencyTo;
    protected $amount;

    public function __construct(
        CurrencyEntity $currencyFrom,
        CurrencyEntity $currencyTo,
        $amount
    ) {
        $this->currencyFrom = $currencyFrom;
        $this->currencyTo = $currencyTo;
        $this->amount = $amount;
    }

    public function isSameCurrecies()
    {
        if (
            $this->currencyFrom->getIndentificationName() ===
            $this->currencyTo->getIndentificationName()
        ) {
            return true;
        }

        return false;
    }

    public function isValidAmount()
    {
        if ($this->amount < 1 || !is_float($this->amount)) {
            return false;
        }

        return true;
    }

    public function CurrencyConversion()
    {
        return ($this->amount / $this->currencyFrom->getExchangeRate()) * $this->currencyTo->getExchangeRate();
    }
}
