<?php

declare(strict_types=1);

namespace App\Exception;

use LosMiddleware\ApiServer\Exception\RuntimeException;
use Mezzio\ProblemDetails\Exception\CommonProblemDetailsExceptionTrait;
use Mezzio\ProblemDetails\Exception\ProblemDetailsExceptionInterface;

class NotAuthorized extends RuntimeException implements ProblemDetailsExceptionInterface
{
    use CommonProblemDetailsExceptionTrait;

    public static function create(string $message = 'Not Authorized'): self
    {
        $exception         = new self($message, 403);
        $exception->status = 403;
        $exception->detail = $message;
        $exception->type   = '';
        $exception->title  = '';

        return $exception;
    }
}
