<?php

namespace App\Domain\UseCases\ProcessInsertCurrency\Dto;

class AddCurrencyInputDto
{
    public function __construct(
        public string $indentificationName
    ) {
    }
}
