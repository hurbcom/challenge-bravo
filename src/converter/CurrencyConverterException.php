<?php

namespace Hurb\CurrencyConverter;

use Exception;

class CurrencyConverterException extends Exception
{
    /**
     * System Error Messages
     *
     * @var array
     */
    private const MESSAGES = [
        1 => 'failed to retrieve currency rates from provider',
        2 => 'failed to get data',
        3 => 'failed to get rate for the informed currency'
    ];

    /**
     * @param integer $code
     * @return void
     */
    public function __construct(int $code)
    {
        parent::__construct(
            self::MESSAGES[$code],
            $code
        );
    }
}
