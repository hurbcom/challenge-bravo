<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Entity\CurrencyEntity;

class CurrencyTest extends TestCase
{
    public function testShouldReturnErrorInValueCurrencyUsingAnyCurrency()
    {
        $currency = new CurrencyEntity();

        $response = $currency->isValidAmount(-1);

        $this->assertFalse($response);
    }

    public function testShouldReturnTrueInValueCurrencyUsingAnyCurrency()
    {
        $currency = new CurrencyEntity();

        $response = $currency->isValidAmount(2.00);

        $this->assertTrue($response);
    }
}
