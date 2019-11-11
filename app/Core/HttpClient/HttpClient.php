<?php

namespace App\Core\HttpClient;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;

abstract class HttpClient
{
    /**
     * @var Client
     */
    private $client;

    /**
     * HttpClient constructor.
     * @param array $config
     */
    public function __construct(array $config = [])
    {
        $default = array_merge($config, [
            'http_errors' => false
        ]);

        $this->client = app(Client::class, ['config' => $default]);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws GuzzleException
     * @throws HttpClientException
     */
    public function do(Request $request): Response
    {
        $key = $request->method(). '-' .$request->fullPath();

        if ($request->cached() && Cache::has($key)) {
            return Cache::get($key);
        }

        $httpResponse = $this
            ->client
            ->request(
                $request->method(),
                $request->fullPath(),
                $request->options()
            );

        $data = json_decode($httpResponse->getBody()->getContents(), true);

        /**
         * @var $response Response
         */
        $response =  app($request->responseClass())
            ->setData($data)
            ->setStatusCode($httpResponse->getStatusCode())
            ->withHeaders($httpResponse->getHeaders());

        Cache::put($key, $response, 300);

        if (!$response->isOk()) {
            throw new HttpClientException(
                $this,
                $request,
                $response
            );
        }

        return $response;
    }
}