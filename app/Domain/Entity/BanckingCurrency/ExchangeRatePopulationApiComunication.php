<?php

namespace App\Domain\Entity\BanckingCurrency;

interface ExchangeRatePopulationApiComunication
{
    public function execute($currencyFrom): string|false;
}
