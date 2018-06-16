<?php

namespace App\Services;

use App\Repositories\RateRepository;
use App\Exceptions\ConversionException;

final class ConverterService
{
    private $rateRepository;

    public function __construct(RateRepository $rateRepository)
    {
        $this->rateRepository = $rateRepository;
    }

    public function getConversionWith(string $currencyCodeOfFrom, string $currencyCodeOfTo, float $amount): string {
        try {
            $fromRate = $this->rateRepository->getBallastRateFor($currencyCodeOfFrom);
            $toRate = $this->rateRepository->getBallastRateFor($currencyCodeOfTo);

            return ($amount / $fromRate) * $toRate;
        } catch(\Exception $e) {
            throw new ConversionException();
        }
    }
}