<?php

declare(strict_types=1);

namespace App\Service\Converter;

use App\Exception\CurrencyValueException;
use App\Model\Currency;
use Brick\Math\BigDecimal;
use PHPUnit\Framework\TestCase;

final class ConverterServiceTest extends TestCase
{
    public function testConvertionFromZero()
    {
        $from = Currency::create('', BigDecimal::zero());
        $converter = new ConverterService();
        $this->expectException(CurrencyValueException::class);
        $converter->from($from);
    }

    public function testConvertionToZero()
    {
        $to = Currency::create('', BigDecimal::zero());
        $converter = new ConverterService();
        $this->expectException(CurrencyValueException::class);
        $converter->to($to);
    }

    public function testConvertionWithAmountZero()
    {
        $from = Currency::create('', BigDecimal::one());
        $to = Currency::create('', BigDecimal::one());

        $converter = new ConverterService();
        $converter->from($from);
        $converter->to($to);
        $result = $converter->amount(BigDecimal::zero());

        $this->assertTrue(
            BigDecimal::zero()->isEqualTo($result),
            "Expected {$result} to be equal to 0"
        );
    }

    /**
     * @dataProvider convertionProvider
     */
    public function testConversion($from, $to, $amount, $expectedResult)
    {
        $from = Currency::create('', $from);
        $to = Currency::create('', $to);

        $converter = new ConverterService();
        $converter->from($from);
        $converter->to($to);

        $result = $converter->amount($amount);

        $this->assertTrue(
            $expectedResult->isEqualTo($result),
            "Expected {$result} to be equal to {$expectedResult}"
        );
    }

    public function convertionProvider()
    {
        return [
            [
                BigDecimal::of('1'),
                BigDecimal::of('1'),
                BigDecimal::of('1'),
                BigDecimal::of('1'),
            ],
            [
                BigDecimal::of('3'),
                BigDecimal::of('3'),
                BigDecimal::of('3'),
                BigDecimal::of('3'),
            ],
            [
                // From: One USD
                BigDecimal::of('1'),
                // To: Five BRL
                BigDecimal::of('5'),
                // Amount: One USD
                BigDecimal::of('1'),
                // Equals to: Five BRL
                BigDecimal::of('5'),
            ],
            [
                BigDecimal::of('5'),
                BigDecimal::of('1'),
                BigDecimal::of('25'),
                BigDecimal::of('5'),
            ]
        ];
    }
}
