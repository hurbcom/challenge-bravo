<?php

namespace Hurb\CurrencyConverter\Frameworks\Lumen;

use Closure;
use DateTime;
use Illuminate\Contracts\Cache\Repository as Cache;

class ConversionResultCacheMiddleware
{
    /**
     * @var Cache
     */
    private $cache;

    /**
     * @var Cache $cache
     * @return void
     */
    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }

    /**
     * If the request is already performed and saved in the cache, it will be returned
     * Otherwise, the default workflow continues
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $signature = sha1($request->getRequestUri());

        $result = $this->cache->get($signature);

        return $result ?? $next($request);
    }

    /**
     * Save the return of the request in the cache
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Response $response
     * @return mixed
     */
    public function terminate($request, $response)
    {
        $signature = sha1($request->getRequestUri());

        $this->cache->put(
            $signature,
            $response,
            $this->calculateCacheTimeInSeconds()
        );
    }

    /**
     * Calculate the expiration time of a request based in the last
     * rate update performed
     *
     * @return integer
     */
    private function calculateCacheTimeInSeconds() : int
    {
        $now = new DateTime();

        $expireCacheTime = $this->cache->get(env('CACHE_EXPIRE_TIME_KEY'));

        $cacheTimeInSeconds =  $expireCacheTime - $now->getTimestamp();

        return $cacheTimeInSeconds;
    }
}
