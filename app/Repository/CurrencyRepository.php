<?php

namespace App\Repository;

use App\Models\Currency;

class CurrencyRepository extends BaseRepository {

    public function __construct(Currency $currency)
    {
        $this->model = $currency;
    }
}