<?php

namespace App\Models;

use App\Core\Currency\Manager;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use Illuminate\Support\Arr;

/**
 * @property string source
 * @property string code
 */
class Currency extends Base
{
    const MANAGER_MAP = [
        ExchangeRatesManager::TYPE => ExchangeRatesManager::class
    ];

    protected $fillable = [
        'code',
        'source'
    ];

    /**
     * @param string $code
     * @return Currency
     */
    public static function findByCode(string $code): Currency
    {
        return self::where('code', $code)->firstOrFail();
    }

    /**
     * @return Manager
     */
    private function manager(): Manager
    {
        $class = Arr::get(self::MANAGER_MAP, $this->source);

        return  app($class);
    }

    /**
     * @param float $amount
     * @return float
     */
    public function toBase(float $amount): float
    {
        return $amount / $this->manager()->toBase($this, $amount);
    }

    /**
     * @param Currency $from
     * @param float $amount
     * @return float|int
     */
    public function convert(Currency $from, float $amount)
    {
        $base = $from->toBase($amount);

        return $base * $this->manager()->toFrom($this, $base);
    }
}
