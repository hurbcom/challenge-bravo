<?php

namespace App\Entity;

class ConverterEntity
{
    protected $currencyFrom;
    protected $currencyTo;

    public function __construct(
        CurrencyEntity $currencyFrom,
        CurrencyEntity $currencyTo
    ) {
        $this->currencyFrom = $currencyFrom;
        $this->currencyTo = $currencyTo;
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
}
