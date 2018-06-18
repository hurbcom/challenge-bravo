<?php

namespace App\Repositories;


interface RateRepository
{
    public function getBallastRateFor(string $currencyCode): float;
}