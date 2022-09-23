<?php

namespace App\Domain\Entity\Currency;

interface CurrencyDeleteRepository
{
    public function delete($indentificationName): string|false;
}
