<?php

namespace App\Entity;

class CurrencyEntity
{
    protected $indentificationName;
    protected $amount;

    public function __construct($indentificationName, $amount)
    {
        $this->indentificationName = $indentificationName;
        $this->amount = $amount;
    }

    public function isValidAmount()
    {
        if ($this->amount < 1) {
            return false;
        }

        return true;
    }

    public function getIndentificationName()
    {
        return $this->indentificationName;
    }
}
