<?php

namespace Tests\Unit;

use App\Entity\CurrencyEntity;
use App\Entity\ConverterEntity;
use PHPUnit\Framework\TestCase;

class ConverterTest extends TestCase
{
    #  public function testShouldReturnErrorInValueCurrencyUsingAnyCurrency()
    public function testShouldNotAcceptSameToSameCurrencyConversion()
    {
        $currenyFrom = new CurrencyEntity('BRL', 1);
        $currencyTo = new CurrencyEntity('BRL', 2);

        $converter = new ConverterEntity($currenyFrom, $currencyTo);

        $response = $converter->isSameCurrecies();

        $this->assertTrue($response);
    }
}
