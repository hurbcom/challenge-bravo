<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\CurrencyRepositoryInterface;
use App\Service\CurrencyUpdater\OpenExchangeRatesUpdater;

/**
 * Update currency database
 */
class UpdateCurrenciesCommand
{
    /**
     * @param boolean $suppressExceptions
     * @return void
     *
     * @throws \Throwable if supression is disabled
     */
    public function __invoke(
        CurrencyRepositoryInterface $currencyRepository,
        OpenExchangeRatesUpdater $openExchangeUpdater
    ) {
        $openExchangeUpdater->update($currencyRepository);
    }
}
