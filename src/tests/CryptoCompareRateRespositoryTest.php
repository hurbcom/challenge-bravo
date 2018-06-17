<?php

use \App\Repositories\CryptoCompareRateRepository;
use \App\Helpers\HttpClient;
use \App\Exceptions\RateParseException;

class CryptoCompareRateRepositoryTest extends TestCase
{

    public function testCorrectPayloadParseOfBrlQuote()
    {
        // setup
        $currencyCode = "BRL";
        $expected = 3.736404;
        $baseUrl = "http://www.mock.net/data/price?fsym=USD&tsyms=%s";

        $httpClient = $this->createMock(HttpClient::class);

        $httpClient->expects($this->once())
            ->method('getBodyOf')
            ->willReturn(json_encode(["{$currencyCode}" => $expected]));

        $rateRepository = new CryptoCompareRateRepository($httpClient, $baseUrl);


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

        $httpClient = $this->createMock(HttpClient::class);

        $httpClient->expects($this->once())
            ->method('getBodyOf')
            ->willReturn('');

        $rateRepository = new CryptoCompareRateRepository($httpClient, $baseUrl);


        // execution
        $rateRepository->getBallastRateFor($currencyCode);
    }
}