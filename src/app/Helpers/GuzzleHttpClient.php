<?php

namespace App\Helpers;

use App\Exceptions\UnableToProcessRequestException as UnableToProcessRequestException;
use GuzzleHttp;

class GuzzleHttpClient implements HttpClient
{
    private $client;

    public function __construct()
    {
        $this->client =  new GuzzleHttp\Client();
    }


    public function getBodyOf(string $url): string
    {
        try {
            $response = $this->client->get($url);
            return $response->getBody()->getContents();
        } catch (\Exception $e) {
            throw new UnableToProcessRequestException();
        }
    }
}