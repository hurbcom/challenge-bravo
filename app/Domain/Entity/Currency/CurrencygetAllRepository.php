<?php

namespace App\Domain\Entity\Currency;

interface CurrencygetAllRepository
{
    public function getAll(): array|false;
}
