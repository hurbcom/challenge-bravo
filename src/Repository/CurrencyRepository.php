<?php

declare(strict_types=1);

namespace App\Repository;

use App\Model\Currency;
use PDO;

class CurrencyRepository
{
    public function __construct(
        private PDO $pdo
    ) {}

    public function get(string $code): ?Currency
    {
        $stmt = $this->pdo->prepare("SELECT * FROM currency WHERE code=?");
        $stmt->execute([$code]);
        $currency = $stmt->fetchObject(Currency::class);
        return $currency;
    }

    public function set(Currency $currency): void
    {
        $sql = "INSERT OR REPLACE INTO currency (code, value, source, created_at, updated_at) VALUES (?,?,?,?,?)";

        $this->pdo->prepare($sql)->execute([
            $currency->getCode(),
            $currency->getValueAsString(),
            $currency->getSource(),
            $currency->getCreatedAtAsSQLString(),
            $currency->getUpdatedAtAsSQLString(),
        ]);
    }
}
