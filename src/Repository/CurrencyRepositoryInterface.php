<?php

declare(strict_types=1);

namespace App\Repository;

use App\Model\Currency;

interface CurrencyRepositoryInterface
{
    public function get(string $code): ?Currency;
    public function set(Currency $currency): void;

    /**
     * Get currencies by source
     *
     * @param string $source
     * @return Currency[]
     */
    public function getBySource(string $source): array;
}
