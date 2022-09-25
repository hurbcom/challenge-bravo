<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\CurrencyInsertRateToFictionalRepository;
use Illuminate\Support\Facades\Redis;

class CurrencyRateAdapterRepository implements CurrencyInsertRateToFictionalRepository
{
    public function insert($indentificationName, $exchangeRateValue): float|false
    {
        $result = Redis::command('SADD', [$indentificationName]);

        if ($result === false) {
            return false;
        }

        return $result;
    }

    public function update($indentificationName): float|false
    {
        return false;
    }
}
