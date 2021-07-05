<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;


class BaseService
{
    protected $client;
    protected $baseUrl;

    public function __construct()
    {
        $this->client = new Client([
            'verify' => false,
            'http_errors' => false,
            'base_uri' => $this->baseUrl,
            'headers' => [
                'Accept' => 'application/json'
            ]
        ]);
    }

    public function request(string $method, string $uri, array $sendData=[])
    {
        $data['json'] = $sendData;
        $request = new Request($method, $uri);
        $request = $response = $this->client->send($request, $data);

        $logData = [
            'url' => $uri,
            'data' => $data,
            'statusCode' => $request->getStatusCode()
        ];

        return json_decode($request->getBody()->getContents());
    }
}