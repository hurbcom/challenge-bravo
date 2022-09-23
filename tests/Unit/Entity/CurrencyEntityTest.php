<?php

namespace Tests\Unit\Entity;

use App\Domain\Entity\Currency\CurrencyEntity;
use PHPUnit\Framework\TestCase;

class CurrencyEntityTest extends TestCase
{
    public function testShouldNotAcceptDifferentsizeThreeForCurrencyIndentificationName()
    {
        $indentificationName = 'ABCD';
        $exchangeRate = 0;
        $currency =  new CurrencyEntity($indentificationName, $exchangeRate);

        $result = $currency->isIndentificationNameWithThreeLetters();

        $this->assertFalse(
            $result
        );
    }

    public function testShouldExchangeRateAcceptFloatValues()
    {
        $indentificationName = 'ABC';
        $exchangeRate = 10.00;
        $currency =  new CurrencyEntity($indentificationName, $exchangeRate);

        $result = $currency->isExchangeRateValid();

        $this->assertTrue(
            $result
        );
    }

    public function testShouldExchangeRateAcceptIntegerValues()
    {
        $indentificationName = 'ABC';
        $exchangeRate = 1;
        $currency =  new CurrencyEntity($indentificationName, $exchangeRate);

        $result = $currency->isExchangeRateValid();

        $this->assertTrue(
            $result
        );
    }

    public function testShouldExchangeRateAcceptBooleanValues()
    {
        $indentificationName = 'ABC';
        $exchangeRate = false;
        $currency =  new CurrencyEntity($indentificationName, $exchangeRate);

        $result = $currency->isExchangeRateValid();

        $this->assertFalse(
            $result
        );
    }

    public function testShouldExchangeRateAcceptArrayValues()
    {
        $indentificationName = 'ABC';
        $exchangeRate = [1,1];
        $currency =  new CurrencyEntity($indentificationName, $exchangeRate);

        $result = $currency->isExchangeRateValid();

        $this->assertFalse(
            $result
        );
    }

    public function testShouldExchangeRateAcceptStringValues()
    {
        $indentificationName = 'ABC';
        $exchangeRate = 'ABC';
        $currency =  new CurrencyEntity($indentificationName, $exchangeRate);

        $result = $currency->isExchangeRateValid();

        $this->assertFalse(
            $result
        );
    }
}
