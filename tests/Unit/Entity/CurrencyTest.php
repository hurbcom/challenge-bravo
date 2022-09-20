<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Entity\CurrencyEntity;

class CurrencyTest extends TestCase
{
    public function testShouldReturnErrorInValueCurrencyUsingAnyCurrency()
    {
        $currency = new CurrencyEntity('BRL', -1);

        $response = $currency->isValidAmount();

        $this->assertFalse($response);
    }

    public function testShouldReturnTrueInValueCurrencyUsingAnyCurrency()
    {
        $currency = new CurrencyEntity('EUR', 2.00);

        $response = $currency->isValidAmount();

        $this->assertTrue($response);
    }
}
