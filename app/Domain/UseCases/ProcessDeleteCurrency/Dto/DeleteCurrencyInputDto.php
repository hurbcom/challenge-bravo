<?php

namespace App\Domain\UseCases\ProcessDeleteCurrency\Dto;

class DeleteCurrencyInputDto
{
    public function __construct(
        public string $indentificationName
    ) {
    }
}
