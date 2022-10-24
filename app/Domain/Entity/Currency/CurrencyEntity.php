<?php

namespace App\Domain\Entity\Currency;

class CurrencyEntity
{
    protected $indentificationName;
    protected $exchangeRate;
    protected $defaultValueForFictional;

    public function __construct($indentificationName, $exchangeRate)
    {
        $this->indentificationName = $indentificationName;
        $this->exchangeRate = $exchangeRate;
        $this->defaultValueForFictional = 1;
    }

    public function isIndentificationNameWithThreeLetters()
    {
        if (strlen($this->indentificationName) > 3 || strlen($this->indentificationName) < 3) {
            return false;
        }

        return true;
    }

    public function isExchangeRateValid()
    {
        if (gettype($this->exchangeRate) === 'integer' || gettype($this->exchangeRate) === 'double') {
            return true;
        }

        return false;
    }

    public function getCurrencyExchangeForFictionalType(
        $valueRepresentationOnBaseCurrency,
        $exchangeRateBaseCurrency
    ) {
        $resultCalcGetConversionDirect = ($valueRepresentationOnBaseCurrency/$exchangeRateBaseCurrency);

        $result = ($this->defaultValueForFictional/$resultCalcGetConversionDirect);

        return $result;
    }

    public function getIndentificationName()
    {
        return $this->indentificationName;
    }

    public function getExchangeRate()
    {
        return $this->exchangeRate;
    }

    public function setExchangeRate($value)
    {
        return $this->exchangeRate = $value;
    }
}
