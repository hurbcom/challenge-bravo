<?php

use PHPUnit\Framework\TestCase;

use App\Models\ExchangeRate;
use App\Models\Currency;

class ExchangeRateTest extends TestCase
{

    public function testGetExchangeWithFromAndToInApiReturn()
    {
        $exRate = rand(1, 10);
        $amount = rand(1, 20);

        $mock = $this->getMockBuilder(ExchangeRate::class)
            ->disableOriginalConstructor()
            ->setMethods(['getRates'])
            ->getMock();
        $mock->expects($this->once())
            ->method('getRates')
            ->will($this->returnValue(json_decode('{"eur" : '.$exRate.'}')));
        $exchange = $mock
            ->from(new Currency(['name' => 'USD']))
            ->to(new Currency(['name' => 'EUR']))
            ->amount($amount)
            ->get();
        $this->assertEquals([
            'status' => true,
            'data' => [
                'from' => 'USD',
                'to' => 'EUR',
                'exchangeRate' => sprintf('%.6f', $exRate),
                'amount' => sprintf('%.6f', $amount),
                'exchange' => sprintf('%.6f', $exRate*$amount),
            ]
        ], $exchange);
    }

}