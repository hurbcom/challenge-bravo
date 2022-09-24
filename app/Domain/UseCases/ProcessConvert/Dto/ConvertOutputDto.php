<?php

namespace App\Domain\UseCases\ProcessConvert\Dto;

class ConvertOutputDto
{
    public function __construct(
        public string $status,
        public string $message,
        public float $valueConverted
    ) {
    }
}
