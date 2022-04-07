<?php

namespace App\Helpers;

class CacheHelper
{
    /**
     * Set Cache.
     * @param String $key
     * @param String $value
     * @param int|null $expire
     *
     * @return String
     */
    public static function set(String $key, String $value, int $expire = null)
    {
        app('redis')->set($key, $value);

        if(!is_null($expire)){
            app('redis')->expire($key, $expire);
        }

        return app('redis')->get($key);
    }

    /**
     * Get Cache.
     * @param String $key
     *
     * @return String|null
     */
    public static function get(String $key)
    {
        return app('redis')->get($key);
    }


}
