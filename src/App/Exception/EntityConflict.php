<?php

declare(strict_types=1);

namespace App\Exception;

use LosMiddleware\ApiServer\Exception\RuntimeException;
use Mezzio\ProblemDetails\Exception\CommonProblemDetailsExceptionTrait;
use Mezzio\ProblemDetails\Exception\ProblemDetailsExceptionInterface;

class EntityConflict extends RuntimeException implements ProblemDetailsExceptionInterface
{
    use CommonProblemDetailsExceptionTrait;

    public static function create(string $message = 'Entity Conflict'): self
    {
        $exception         = new self($message, 409);
        $exception->status = 409;
        $exception->detail = $message;
        $exception->type   = '';
        $exception->title  = 'Entity Conflict';

        return $exception;
    }
}
