<?php

declare(strict_types=1);

namespace App\Repository;

use App\Model\Currency;
use PDO;

class CurrencyRepository implements CurrencyRepositoryInterface
{
    public function __construct(
        private PDO $pdo
    ) {}

    public function get(string $code): ?Currency
    {
        $stmt = $this->pdo->prepare("SELECT * FROM currency WHERE code=?");
        $stmt->execute([$code]);
        $currency = $stmt->fetchObject(Currency::class);
        return $currency ?: null;
    }

    public function set(Currency $currency): void
    {
        if ($this->get($currency->getCode())) {
            $sql = "UPDATE currency SET code = :code, value = :value, source = :source WHERE code = :code";
        } else {
            $sql = "INSERT INTO currency (code, value, source) VALUES (:code, :value, :source)";
        }

        $this->pdo->prepare($sql)->execute([
            'code' => $currency->getCode(),
            'value' => $currency->getValueAsString(),
            'source' => $currency->getSource(),
        ]);
    }

    /**
     * @inheritDoc
     */
    public function getBySource(string $source): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM currency WHERE source=?");
        $stmt->execute([$source]);
        return $stmt->fetchAll(PDO::FETCH_CLASS, Currency::class);
    }
}
