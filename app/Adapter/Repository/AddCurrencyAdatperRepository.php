<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\CurrencyInsertRepository;
use Illuminate\Support\Facades\Redis;

class AddCurrencyAdatperRepository implements CurrencyInsertRepository
{
    public function insert($indentificationName): string|false
    {
        $result = Redis::command('SET', [$indentificationName, 0]);

        if ($result === false) {
            return false;
        }

        return 'Insertion with success';
    }
}
