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
            $this->currencyFrom->indentificationName ===
            $this->currencyTo->indentificationName
        ) {
            return true;
        }

        return false;
    }

    # Possile implentations:
    # - Now its only aceppted amounts less than 3000, because higher than that our partner dont accept.
}
