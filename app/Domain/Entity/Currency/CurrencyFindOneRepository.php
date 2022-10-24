<?php

namespace App\Domain\Entity\Currency;

interface CurrencyFindOneRepository
{
    public function findOne($indentificationName): string|false;
}
