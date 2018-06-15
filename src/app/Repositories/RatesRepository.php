<?php

namespace App\Repositories;


interface RatesRepository
{
    public function getBallastRateFor(string $currencyCode): float;
}