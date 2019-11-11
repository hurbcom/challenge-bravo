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
        // read error from exchange rates format
        return $this->getFieldData('error_message', 'Message error default');
    }

    /**
     * @return string
     */
    public function getErrorCode(): string
    {
        // read error from exchange rates format
        return $this->getFieldData('error_code', 'ERR001');
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