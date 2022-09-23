<?php

namespace App\Domain\UseCases\ProcessInsertCurrency\Dto;

class AddCurrencyOutputDto
{
    public function __construct(
        public string $status,
        public string $errorMessage
    ) {
    }
}
