<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\CurrencyFindOneRepository;
use Illuminate\Support\Facades\Redis;

class ConventerAdatperRepository implements CurrencyFindOneRepository
{
    public function findOne($indentificationName): string|false
    {
        $result = Redis::command('GET', [$indentificationName]);

        if ($result === false) {
            return false;
        }

        return $result;
    }
}
