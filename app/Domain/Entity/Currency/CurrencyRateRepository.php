<?php

namespace App\Domain\Entity\Currency;

interface CurrencyRateRepository
{
    public function get($indentificationName): float|false;
}
