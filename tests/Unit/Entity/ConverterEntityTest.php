<?php

namespace Tests\Unit\Entity;

use App\Domain\Entity\Currency\CurrencyEntity;
use App\Domain\Entity\Converter\ConverterEntity;
use PHPUnit\Framework\TestCase;

class ConverterEntityTest extends TestCase
{
    public function testShouldNotConvertIfCurrenciesAreEqual()
    {
        $CurrencyFromIndentificationName = 'ABCD';
        $CurrencyFromExchangeRate = 1;
        $currencyFrom =  new CurrencyEntity($CurrencyFromIndentificationName, $CurrencyFromExchangeRate);

        $CurrencyToIndentificationName = 'ABCD';
        $CurrencyToExchangeRate = 2;
        $currencyTo =  new CurrencyEntity($CurrencyToIndentificationName, $CurrencyToExchangeRate);

        $amount = 10.00;

        $convert = new ConverterEntity($currencyFrom, $currencyTo, $amount);

        $result = $convert->isSameCurrecies();

        $this->assertTrue(
            $result
        );
    }

    public function testShouldNotCalculateWithInvalidAmountValue()
    {
        $CurrencyFromIndentificationName = 'ABCD';
        $CurrencyFromExchangeRate = 1;
        $currencyFrom =  new CurrencyEntity($CurrencyFromIndentificationName, $CurrencyFromExchangeRate);

        $CurrencyToIndentificationName = 'EFGH';
        $CurrencyToExchangeRate = 2;
        $currencyTo =  new CurrencyEntity($CurrencyToIndentificationName, $CurrencyToExchangeRate);

        $amount = 'lorem ipsum';

        $convert = new ConverterEntity($currencyFrom, $currencyTo, $amount);

        $result = $convert->isValidAmount();

        $this->assertFalse(
            $result
        );
    }
}
