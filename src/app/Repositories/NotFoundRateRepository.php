<?php

namespace App\Repositories;

use App\Exceptions\NotFoundRateException;

class NotFoundRateRepository implements RateRepository
{

    public function getBallastRateFor(string $currencyCode): float
    {
        throw new NotFoundRateException();
    }
}