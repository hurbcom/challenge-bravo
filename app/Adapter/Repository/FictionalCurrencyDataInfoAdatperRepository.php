<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\FictionalCurrencyDataInfoRepository;
use Illuminate\Support\Facades\Redis;

class FictionalCurrencyDataInfoAdatperRepository implements FictionalCurrencyDataInfoRepository
{
    public function getAll(): array|false
    {
        $result = Redis::command('SSCAN', ['fictionalCurrencies', 0]);

        if (empty($result[1])) {
            return false;
        }

        return $result[1];
    }

    public function insert($indentificationName): string|false
    {
        $result = Redis::command('SADD', ['fictionalCurrencies', $indentificationName]);

        if ($result === false) {
            return false;
        }

        return $result;
    }

    public function delete($indentificationName): string|false
    {
        $result = Redis::command('SREM', ['fictionalCurrencies', $indentificationName]);

        if ($result === false) {
            return false;
        }

        return $result;
    }
}
