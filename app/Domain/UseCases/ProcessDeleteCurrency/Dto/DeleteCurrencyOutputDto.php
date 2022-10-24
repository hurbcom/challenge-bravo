<?php

namespace App\Domain\UseCases\ProcessDeleteCurrency\Dto;

class DeleteCurrencyOutputDto
{
    public function __construct(
        public string $status,
        public string $errorMessage
    ) {
    }
}
