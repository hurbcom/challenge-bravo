<?php

declare(strict_types=1);

namespace App\Service\CurrencyUpdater;

use App\Repository\CurrencyRepositoryInterface;

interface CurrencyUpdaterInterface
{
    /**
     * Updater identifier
     *
     * @return string
     */
    public static function getId(): string;

    /**
     * A call to update currencies belonging to this source
     *
     * @param CurrencyRepositoryInterface $currencyRepository
     */
    public function update(CurrencyRepositoryInterface $currencyRepository): void;
}
