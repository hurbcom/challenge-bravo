<?php

declare(strict_types=1);

namespace Tests\Unit\Api;

use App\Models\Currency;
use PHPUnit\Framework\TestCase;

class CurrencyTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->currency = new Currency();
    }

    public function test_fillable() : void
    {
        $fillable = ['code_currency', 'base_currency', 'equivalent_value'];
        $this->assertEquals($fillable, $this->currency->getFillable());
    }
}
