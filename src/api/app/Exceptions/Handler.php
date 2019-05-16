<?php

namespace Hurb\Api\Exceptions;

use Exception;
use Hurb\CurrencyConverter\CurrencyConverterException;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        CurrencyConverterException::class,
        ValidationException::class
    ];

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function render($request, Exception $exception)
    {
        if ($exception instanceof ValidationException) {
            //
        }

        return parent::render($request, $exception);
    }
}
