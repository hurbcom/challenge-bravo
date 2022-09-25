<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\CurrencyInsertRepository;
use Illuminate\Support\Facades\Redis;

class AddCurrencyAdatperRepository implements CurrencyInsertRepository
{
    public function insert($indentificationName, $exchangeRate): string|false
    {
        $result = Redis::command('SET', [$indentificationName, $exchangeRate]);

        if ($result === false) {
            return false;
        }

        return 'Insertion with success';
    }
}
