<?php

namespace App\Domain\UseCases\ProcessConvert\Dto;

class ConvertInputDto
{
    public function __construct(
        public string $currencyFrom,
        public string $currencyTo,
        public float $amount
    ) {
    }
}
