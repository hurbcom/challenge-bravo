<?php

namespace App\Helpers;


use Illuminate\Redis\RedisManager;

final class RedisCacheClient implements CacheClient
{
    private $redisManager;

    public function __construct(RedisManager $redisManager)
    {
        $this->redisManager = $redisManager;
    }

    public function isSet(string $key): bool
    {
        return $this->redisManager->exists($key);
    }

    public function setWith(string $key, $value, $ttlInSeconds=-1): void
    {
        if ($ttlInSeconds > 0) {
            $this->redisManager->set($key, $value);
        }

        $this->redisManager->setex($key, $ttlInSeconds, $value);
    }

    public function getValueOf(string $key)
    {
        return $this->redisManager->get($key);
    }
}