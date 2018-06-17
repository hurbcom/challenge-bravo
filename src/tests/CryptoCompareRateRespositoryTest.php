<?php

use \App\Repositories\CryptoCompareRateRepository;
use \App\Helpers\HttpClient;
use \App\Exceptions\RateParseException;
use App\Repositories\RateRepository;

class CryptoCompareRateRepositoryTest extends TestCase
{

    public function testCorrectPayloadParseOfBrlQuote()
    {
        // setup
        $currencyCode = "BRL";
        $expected = 3.736404;
        $baseUrl = "http://www.mock.net/data/price?fsym=USD&tsyms=%s";
        $supportedCurrencies = ['BRL'];

        $nextRateRepository = $this->createMock(RateRepository::class);

        $httpClient = $this->createMock(HttpClient::class);

        $httpClient->expects($this->once())
            ->method('getBodyOf')
            ->willReturn(json_encode(["{$currencyCode}" => $expected]));

        $rateRepository = new CryptoCompareRateRepository($httpClient, $baseUrl, $nextRateRepository, $supportedCurrencies);


        // execution
        $actual = $rateRepository->getBallastRateFor($currencyCode);

        // assertions
        $this->assertEquals($expected, $actual);
    }

    public function testRateParseException()
    {
        // setup
        $this->expectException(RateParseException::class);
        $currencyCode = "BRL";
        $baseUrl = "http://www.mock.net/data/price?fsym=USD&tsyms=%s";
        $supportedCurrencies = ['BRL'];

        $nextRateRepository = $this->createMock(RateRepository::class);

        $httpClient = $this->createMock(HttpClient::class);

        $httpClient->expects($this->once())
            ->method('getBodyOf')
            ->willReturn('');

        $rateRepository = new CryptoCompareRateRepository($httpClient, $baseUrl, $nextRateRepository, $supportedCurrencies);


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


        $rateRepository = new CryptoCompareRateRepository($httpClient, $baseUrl, $nextRateRepository, $supportedCurrencies);


        // execution
        $actual = $rateRepository->getBallastRateFor($currencyCode);

        // assertions
        $this->assertEquals($expected, $actual);
    }
}