<?php

namespace App\Domain\Entity\Currency;

interface CurrencyInsertRepository
{
    public function insert($indentificationName): string|false;
}
