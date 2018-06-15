<?php

namespace App\Services;

use App\Repositories\RatesRepository;

final class ConverterService
{
    private $ratesRepository;

    public function __construct(RatesRepository $ratesRepository)
    {
        $this->ratesRepository = $ratesRepository;
    }

    public function getConversionWith(string $currencyCodeOfFrom, string $currencyCodeOfTo, float $amount): string {
        $fromRate = $this->ratesRepository->getBallastRateFor($currencyCodeOfFrom);
        $toRate = $this->ratesRepository->getBallastRateFor($currencyCodeOfTo);

        return ($amount / $fromRate) * $toRate;
    }
}