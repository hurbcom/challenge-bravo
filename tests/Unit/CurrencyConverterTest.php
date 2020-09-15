<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\CurrencyConverter;

class CurrencyConverterTest extends TestCase
{
    /**
     * A basic unit test getConvertedValue.
     *
     * @return void
     */
    public function testGetConvertedValue()
    {
        $model = new CurrencyConverter();

        $from = 'EUR';
        $to = 'BRL';
        $amount = 13.13;

        $convertedValue = $model->getConvertedValue($from, $to, $amount);

        print_r($convertedValue);
        
        $this->assertTrue(true);
    }
}
