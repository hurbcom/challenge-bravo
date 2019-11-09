<?php

namespace App\Core\Currency;

use App\Models\Currency;

interface Manager
{
    const BASE_CURRENCY = 'USD';

    public function toBase(Currency $currency): float;
}