<?php

namespace Hurb\Tests\CurrencyConverter\CurrencyConverter;

use GuzzleHttp\ClientInterface as Client;
use Hurb\CurrencyConverter\Providers\CryptoCompareRateProvider;
use Hurb\CurrencyConverter\CurrencyConverterException;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;

class CryptoCompareRateProviderTest extends TestCase
{
    public function testRetrieveSucceed()
    {
        $rates = [
            'USD' => 1,
            'BRL' => 4
        ];

        $response = $this->createMock(ResponseInterface::class);
        $response
            ->expects($this->once())
            ->method('getBody')
            ->willReturn(json_encode($rates));

        $client = $this->createMock(Client::class);
        $client
            ->expects($this->once())
            ->method('request')
            ->withAnyParameters()
            ->willReturn($response);

        $rateProvider = new CryptoCompareRateProvider($client);

        $this->assertEquals($rates, $rateProvider->retrieve());
    }

    public function testRetrieveWithNoRequestFailed()
    {
        $client = $this->createMock(Client::class);
        $client
            ->expects($this->once())
            ->method('request')
            ->withAnyParameters()
            ->willThrowException(new \Exception(''));

        $rateProvider = new CryptoCompareRateProvider($client);

        $this->expectException(CurrencyConverterException::class);

        $rateProvider->retrieve();
    }


    public function testSaveValueWithKeySucceed()
    {
        $rates = null;

        $response = $this->createMock(ResponseInterface::class);
        $response
            ->expects($this->once())
            ->method('getBody')
            ->willReturn($rates);

        $client = $this->createMock(Client::class);
        $client
            ->expects($this->once())
            ->method('request')
            ->withAnyParameters()
            ->willReturn($response);

        $rateProvider = new CryptoCompareRateProvider($client);

        $this->expectException(CurrencyConverterException::class);

        $rateProvider->retrieve();
    }
}
