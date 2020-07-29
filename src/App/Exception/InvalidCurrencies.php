<?php

declare(strict_types=1);

namespace App\Exception;

use LosMiddleware\ApiServer\Exception\RuntimeException;
use Mezzio\ProblemDetails\Exception\CommonProblemDetailsExceptionTrait;
use Mezzio\ProblemDetails\Exception\ProblemDetailsExceptionInterface;

class InvalidCurrencies extends RuntimeException implements ProblemDetailsExceptionInterface
{
    use CommonProblemDetailsExceptionTrait;

    public static function create(string $message = 'Invalid Currencies'): self
    {
        $exception         = new self($message, 400);
        $exception->status = 400;
        $exception->detail = $message;
        $exception->type   = '';
        $exception->title  = '';

        return $exception;
    }
}
