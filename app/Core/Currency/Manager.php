<?php

namespace App\Core\Currency;

use App\Models\Currency;

interface Manager
{
    const BASE_CURRENCY = 'USD';

    public function toBase(Currency $currency, float $amount): float;

    public function toFrom(Currency $to, float $baseCurrency): float;
}