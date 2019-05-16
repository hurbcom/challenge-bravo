<?php

namespace Hurb\CurrencyConverter;

use DateTime;
use Hurb\CurrencyConverter\Providers\ProviderInterface;
use Hurb\CurrencyConverter\Repositories\RepositoryInterface;

class RateProviderCacheHandler
{
    /**
     * @var ProviderInterface
     */
    private $provider;

    /**
    * @var RepositoryInterface
    */
    private $repository;

    /**
     * @var string
     */
    private $cacheKey;

    /**
     * @var int
     */
    private $cacheTime;

    /**
     * @param ProviderInterface $provider
     * @param RepositoryInterface $repository
     * @param string $cacheKey
     * @param int $cacheTime $time in seconds
     * @return void
     */
    public function __construct(
        ProviderInterface $provider,
        RepositoryInterface $repository,
        string $cacheKey,
        int $cacheTime = 0
    ) {
        $this->provider = $provider;
        $this->repository = $repository;
        $this->cacheKey = $cacheKey;
        $this->cacheTime = $cacheTime;
    }

    /**
     * Update the repository cache with currency from the provider
     * considering the time configured to the cache expire
     *
     * @return void
     */
    public function handle() : void
    {
        $strtotime = $this->repository->get($this->cacheKey);
        $now = new DateTime("now");

        if ($strtotime >= $now->getTimestamp()) {
            return;
        }

        $rates = $this->provider->retrieve();

        foreach ($rates as $currency => $rate) {
            $this->repository->save($currency, $rate);
        }

        $expireDate = new DateTime("+ {$this->cacheTime} seconds");

        $this->repository->save($this->cacheKey, $expireDate->getTimestamp());
    }
}
