<?php

namespace App\Domain\Entity\BanckingCurrency;

class BanckingCurrencyEntity
{
    protected $indentificantionName;

    public function __construct()
    {
        $this->indentificantionName = 'USD';
    }

    public function getIndentificantionName()
    {
        return $this->indentificantionName;
    }
}
