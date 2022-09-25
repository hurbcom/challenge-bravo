<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\FictionalCurrencyDataInfoRepository;
use Illuminate\Support\Facades\Redis;

class FictionalCurrencyDataInfoAdatperRepository implements FictionalCurrencyDataInfoRepository
{
    public function getAll(): array|false
    {
        $result = Redis::command('KEYS', ['*']);

        if (empty($result)) {
            return false;
        }

        return $result;
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
