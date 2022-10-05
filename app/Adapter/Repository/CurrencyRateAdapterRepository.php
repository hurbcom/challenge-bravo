<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\CurrencyRateRepository;
use Illuminate\Support\Facades\Redis;

class CurrencyRateAdapterRepository implements CurrencyRateRepository
{
    public function get($indentificationName): float|false
    {
        $result = Redis::command('GET', [$indentificationName]);

        if ($result === false) {
            return false;
        }

        return $result;
    }
}
