<?php

namespace App\Repositories;


use App\Exceptions\RateParseException;
use App\Helpers\HttpClient;

final class ApilayerRateRepository implements RateRepository
{
    private $httpClient;
    private $baseUrl;
    private $nextRateRepository;
    private $currencies;

    public function __construct(HttpClient $httpClient, string $baseUrl, RateRepository $nextRateRepository, array $currencies)
    {
        $this->httpClient = $httpClient;
        $this->baseUrl = $baseUrl;
        $this->nextRateRepository = $nextRateRepository;
        $this->currencies = $currencies;
    }

    public function getBallastRateFor(string $currencyCode): float
    {
        try {
            if (in_array($currencyCode, $this->currencies)) {
                $url = $this->getFormattedUrlWith($this->baseUrl, $currencyCode);
                return $this->getValueFrom($url);
            }

            return $this->nextRateRepository->getBallastRateFor($currencyCode);
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
