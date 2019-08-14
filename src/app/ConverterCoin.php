<?php

namespace App;

use Illuminate\Support\Facades\Cache;

class ConverterCoin
{
    protected $to;
    protected $from;
    protected $amount;


    /**
     * Hydrate class
     *
     * @return void
     */
    public function hydrate(array $array)
    {
        foreach ($array as $key => $item) {
            if (array_key_exists($key, get_object_vars($this))) {
                $this->$key = $item;
            }
        }
    }

    /**
     * Get properties
     *
     * @return void
     */
    public function get($properties)
    {
        return $this->$properties;
    }

    /**
     * Get or Create Cache for request
     *
     * @param [varchar] $to
     * @param [varchar] $from
     * @param [integer] $amount
     * @return void
     */
    public function hasCache()
    {
        if (!Cache::has("{$this->to}-{$this->from}-{$this->amount}")) {
            return false;
        }

        return true;
    }

    /**
     * Get or Create Cache for request
     *
     * @param [varchar] $to
     * @param [varchar] $from
     * @param [integer] $amount
     * @return void
     */
    public function createCache($response)
    {
        return Cache::put("{$this->to}-{$this->from}-{$this->amount}", $response);
    }

    /**
     * Get or Create Cache for request
     *
     * @param [varchar] $to
     * @param [varchar] $from
     * @param [integer] $amount
     * @return void
     */
    public function getCache()
    {
        return Cache::get("{$this->to}-{$this->from}-{$this->amount}");
    }
}
