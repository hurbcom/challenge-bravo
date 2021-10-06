<?php

namespace App\Repositories;

use App\Models\Currency;
use App\Repositories\Contracts\CurrencyRepositoryInterface;

class CurrencyRepository extends BaseRepository implements CurrencyRepositoryInterface
{
    public function model() : string
    {
        return Currency::class;
    }
}
