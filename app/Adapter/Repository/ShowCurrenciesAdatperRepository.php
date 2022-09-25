<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\CurrencygetAllRepository;
use Illuminate\Support\Facades\Redis;

class ShowCurrenciesAdatperRepository implements CurrencygetAllRepository
{
    public function getAll(): array|false
    {
        $result = Redis::command('SCAN', ['0', 'TYPE', 'STRING']);

        if (empty($result[1])) {
            return false;
        }

        return $result[1];
    }
}
