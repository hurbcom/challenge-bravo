<?php

declare(strict_types=1);

namespace App\Service;

use App\Exception\InvalidCurrencies;
use App\Mapper\CurrencyMapper;
use Laminas\Cache\Storage\StorageInterface;

use function md5;
use function var_export;

class ExchangeService
{
    private CurrencyMapper $currencyMapper;
    private StorageInterface $cache;
    private ExternalApiService $externalApiService;

    public function __construct(
        CurrencyMapper $currencyMapper,
        StorageInterface $cache,
        ExternalApiService $externalApiService
    ) {
        $this->currencyMapper     = $currencyMapper;
        $this->cache              = $cache;
        $this->externalApiService = $externalApiService;
    }

    public function exchange(string $from, string $to, float $amount): float
    {
        $cacheKey = md5(self::class . __FUNCTION__ . var_export([$from, $to], true));
        if ($this->cache->hasItem($cacheKey)) {
            $currencyAmount = $this->cache->getItem($cacheKey);

            return $currencyAmount * $amount;
        }

        $result = $this->currencyMapper->fetchByNames([$from, $to]);
        if ($result === null) {
            throw InvalidCurrencies::create();
        }

        $currencyAmount = $this->externalApiService->fetchUpdatedCurrency($from, $to);
        $this->cache->setItem($cacheKey, $currencyAmount);

        return $currencyAmount * $amount;
    }
}
