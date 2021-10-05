<?php

declare(strict_types=1);

namespace App\Exception;

use Exception;
use Throwable;

class CurrencyValueException extends Exception
{
    public function __construct($message = "Currency value is invalid", $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
