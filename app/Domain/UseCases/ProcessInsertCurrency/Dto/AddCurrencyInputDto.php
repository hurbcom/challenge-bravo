<?php

namespace App\Domain\UseCases\ProcessInsertCurrency\Dto;

class AddCurrencyInputDto
{
    public function __construct(
        public string $indentificationName,
        public bool $isFictional,
        public string $baseCurrencyForFictionalType,
        public float $valueBasedOnRealCurrency
    ) {
    }
}
