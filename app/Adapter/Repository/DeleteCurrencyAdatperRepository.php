<?php

namespace App\Adapter\Repository;

use App\Domain\Entity\Currency\CurrencyDeleteRepository;
use Illuminate\Support\Facades\Redis;

class DeleteCurrencyAdatperRepository implements CurrencyDeleteRepository
{
    public function delete($indentificationName): string|false
    {
        $result = Redis::command('DEL', [$indentificationName]);

        if (boolval($result) === false) {
            return false;
        }

        return 'Currency deleted with success';
    }
}
