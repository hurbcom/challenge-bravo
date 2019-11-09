<?php

namespace App\Core\Currency\Source\ExchangeRates;

use App\Core\HttpClient\Response;

class FindRatesResponse extends Response
{
    /**
     * @return string
     */
    public function getErrorMessage(): string
    {
        return '';
    }

    /**
     * @return string
     */
    public function getErrorCode(): string
    {
        return '';
    }

    /**
     * @param string $code
     * @return float
     */
    public function getValue(string $code): float
    {
        return $this->getFieldData('rates.'.$code);
    }
}