<?php

use \App\Repositories\ApilayerRateRepository;
use \App\Repositories\RateRepository;
use \App\Helpers\HttpClient;
use \App\Exceptions\RateParseException;

class ApilayerRateRepositoryTest extends TestCase
{

    public function testCorrectPayloadParseOfBrlQuote()
    {
        // setup
        $sourceCode = "USD";
        $currencyCode = "BRL";
        $expected = 3.736404;
        $baseUrl = "http://www.mock.net/api/live?currency=%s";
        $supportedCurrencies = ['BRL'];

        $nextRateRepository = $this->createMock(RateRepository::class);

        $httpClient = $this->createMock(HttpClient::class);

        $httpClient->expects($this->once())
            ->method('getBodyOf')
            ->willReturn(json_encode(
                [
                    'success' => 'true',
                    'terms' => 'https://currencylayer.com/terms',
                    'privacy' => 'https://currencylayer.com/privacy',
                    'timestamp' => time(),
                    'source' => $sourceCode,
                    'quotes' => [
                        "{$sourceCode}{$currencyCode}" => $expected
                    ]
                ]
            ));

        $rateRepository = new ApilayerRateRepository($httpClient, $baseUrl, $nextRateRepository, $supportedCurrencies);


        // execution
        $actual = $rateRepository->getBallastRateFor($currencyCode);

        // assertions
        $this->assertEquals($expected, $actual);
    }

    public function testRateParseException()
    {
        // setup
        $this->expectException(RateParseException::class);
        $sourceCode = "USD";
        $currencyCode = "BRL";
        $baseUrl = "http://www.mock.net/api/live?currency=%s";
        $supportedCurrencies = ['BRL'];

        $nextRateRepository = $this->createMock(RateRepository::class);

        $httpClient = $this->createMock(HttpClient::class);

        $httpClient->expects($this->once())
            ->method('getBodyOf')
            ->willReturn(json_encode(
                [
                    'success' => 'true',
                    'terms' => 'https://currencylayer.com/terms',
                    'privacy' => 'https://currencylayer.com/privacy',
                    'timestamp' => time(),
                    'source' => $sourceCode
                ]
            ));

        $rateRepository = new ApilayerRateRepository($httpClient, $baseUrl, $nextRateRepository, $supportedCurrencies);


        // execution
        $rateRepository->getBallastRateFor($currencyCode);
    }

    public function testRateFromNextRepository()
    {
        // setup
        $currencyCode = "BRL";
        $expected = 3.736404;
        $baseUrl = "http://www.mock.net/api/live?currency=%s";
        $supportedCurrencies = ['EUR'];

        $nextRateRepository = $this->createMock(RateRepository::class);

        $nextRateRepository->expects($this->once())
            ->method('getBallastRateFor')
            ->willReturn($expected);

        $httpClient = $this->createMock(HttpClient::class);


        $rateRepository = new ApilayerRateRepository($httpClient, $baseUrl, $nextRateRepository, $supportedCurrencies);


        // execution
        $actual = $rateRepository->getBallastRateFor($currencyCode);

        // assertions
        $this->assertEquals($expected, $actual);
    }
}