<?php

namespace Hurb\Tests\CurrencyConverter\CurrencyConverter;

use PHPUnit\Framework\TestCase;
use Hurb\CurrencyConverter\Converter;
use Hurb\CurrencyConverter\CurrencyConverterException;
use Hurb\CurrencyConverter\Repositories\RepositoryInterface;

class ConverterTest extends TestCase
{
    public function testConvertCurrencySucceed()
    {
        $from = 'USD';
        $to = 'BRL';
        $amount = 2.0;
        $result = 8.0;
        $rates = [
            $from => 1.0,
            $to => 4.0
        ];

        $map = [
            [
                $from,
                $rates[$from]
            ],
            [
                $to,
                $rates[$to]
            ],
        ];

        $repository = $this->createMock(RepositoryInterface::class);
        $repository
            ->expects($this->exactly(2))
            ->method('get')
            ->will($this->returnValueMap($map));

        $converter = new Converter($repository);

        $this->assertEquals($result, $converter->convert($from, $to, $amount));
    }

    public function testGetValueWithInvalidKeyFailed()
    {
        $from = 'USD';
        $to = 'BRL';
        $amount = 2.0;
        $result = 8.0;

        $repository = $this->createMock(RepositoryInterface::class);
        $repository
            ->expects($this->once())
            ->method('get')
            ->willReturn(null);

        $converter = new Converter($repository);

        $this->expectException(CurrencyConverterException::class);

        $converter->convert($from, $to, $amount);
    }
}
