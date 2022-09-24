<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\CurrencygetAllRepository;
use Illuminate\Support\Facades\Redis;

class ShowCurrenciesAdatperRepository implements CurrencygetAllRepository
{
    public function getAll(): array|false
    {
        $result = Redis::command('KEYS', ['*']);

        if (empty($result)) {
            return false;
        }

        return $result;
    }
}
