<?php

namespace App\Exceptions;

use App\Core\HttpClient\HttpClientException;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
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
            return $this->renderValidationException($exception);
        } elseif ($exception instanceof HttpClientException) {
            return $this->renderHttpClientException($exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * @param ValidationException $exception
     * @return JsonResponse
     */
    protected function renderValidationException(ValidationException $exception): JsonResponse
    {
        $data = ['errors' => $exception->errors()];

        return response()->json($data, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * @param HttpClientException $exception
     * @return JsonResponse
     */
    private function renderHttpClientException(HttpClientException $exception)
    {
        $data = [
            'error_message' => $exception->getClientMessage()
        ];

        return response()->json($data, $exception->statusCode());
    }
}
