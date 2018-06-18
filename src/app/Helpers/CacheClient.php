<?php

namespace App\Helpers;

interface CacheClient
{
    public function isSet(string $key): bool;
    public function setWith(string $key, $value, int $ttlInSeconds=-1): void;
    public function getValueOf(string $key);
}