<?php

namespace App\Entity;

class CurrencyEntity
{
    protected $indentificationName;
    protected $amount;

    public function isValidAmount($amount)
    {
        if ($amount < 1) {
            return false;
        }

        return true;
    }

    # Possile implentations:
    # - Now its only aceppted amounts less than 3000, because higher than that our partner dont accept.
}
