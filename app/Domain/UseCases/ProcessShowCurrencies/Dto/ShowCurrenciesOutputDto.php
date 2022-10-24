<?php

namespace App\Domain\UseCases\ProcessShowCurrencies\Dto;

class ShowCurrenciesOutputDto
{
    public function __construct(
        public string $status,
        public mixed $message
    ) {
    }
}
