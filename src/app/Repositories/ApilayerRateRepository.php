<?php

namespace App\Repositories;


use App\Exceptions\RateParseException;
use App\Helpers\HttpClient;

final class ApilayerRateRepository implements RateRepository
{
    private $httpClient;
    private $baseUrl;

    public function __construct(HttpClient $httpClient, string $baseUrl)
    {
        $this->httpClient = $httpClient;
        $this->baseUrl = $baseUrl;
    }

    public function getBallastRateFor(string $currencyCode): float
    {
        try {
            $url = $this->getFormattedUrlWith($this->baseUrl, $currencyCode);
            return $this->getValueFrom($url);
        } catch (\Exception $e) {
            throw new RateParseException();
        }
    }

    private function getFormattedUrlWith(string $baseUrl, string $currencyCode): string
    {
        return sprintf($baseUrl,$currencyCode);
    }

    private function getValueFrom(string $url): float
    {
        $content = $this->httpClient->getBodyOf($url);
        $decodedContent = json_decode($content);
        return (float)current($decodedContent->quotes);
    }
}
