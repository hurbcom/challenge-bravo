<?php

namespace App\Domain\Entity\Currency;

interface FictionalCurrencyDataInfoRepository
{
    public function insert($indentificationName): string|false;
    public function getAll(): array|false;
    public function delete($indentificationName): string|false;
}
