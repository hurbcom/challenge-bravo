<?php

namespace App\Core\HttpClient;

use Exception;
use Throwable;

class HttpClientException extends Exception
{
    /**
     * @var int
     */
    private $statusCode;

    /**
     * @var string
     */
    private $clientMessage;

    /**
     * HttpClientException constructor.
     * @param HttpClient $client
     * @param Request $request
     * @param Response $response
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct(HttpClient $client, Request $request, Response $response, $code = 0, Throwable $previous = null)
    {
        $this->statusCode = $response->status();

        $this->clientMessage = sprintf('%s - %s', $response->getErrorCode(), $response->getErrorMessage()) ;

        $message = $this->prepareMessage($client, $request);

        parent::__construct($message, $code, $previous);
    }

    /**
     * @param HttpClient $client
     * @param Request $request
     * @return string
     */
    private function prepareMessage(HttpClient $client, Request $request): string
    {
        return sprintf(
            'Error on client %s when trying to request %s (%s %s)',
            get_class($client),
            get_class($request),
            $request->method(),
            $request->fullPath()
        );
    }

    /**
     * @return string
     */
    public function getClientMessage(): string
    {
        return $this->clientMessage;
    }

    /**
     * @return int
     */
    public function statusCode(): int
    {
        return $this->statusCode;
    }
}