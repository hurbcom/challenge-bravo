<?php

namespace App\Repositories;

use App\Helpers\CacheClient;

final class RedisRateRepository implements RateRepository
{
    private $cacheClient;
    private $rateRepository;
    private $renewCache;

    public function __construct(CacheClient $cacheClient, RateRepository $rateRepository, $renewCache=false)
    {
        $this->rateRepository = $rateRepository;
        $this->cacheClient = $cacheClient;
        $this->renewCache = $renewCache;
    }

    public function getBallastRateFor(string $currencyCode): float
    {
        $redisKey = $this->makeRedisKey($currencyCode);
        if($this->renewCache === true || !$this->cacheClient->isSet($redisKey)){
            $this->cacheClient->setWith(
                $redisKey,
                $this->rateRepository->getBallastRateFor($currencyCode),
                3600
            );
        }

        return (float) $this->cacheClient->getValueOf($redisKey);
    }

    private function makeRedisKey($currencyCode)
    {
        return sprintf("RATE:%s",$currencyCode);
    }
}