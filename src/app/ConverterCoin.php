<?php

namespace App;

use Illuminate\Support\Facades\Cache;

class ConverterCoin
{
    protected $to;
    protected $from;
    protected $amount;
    protected $converter;
    protected $quotation;

    /**
     * Hydrate class
     *
     * @return void
     */
    public function hydrate(array $array)
    {
        foreach ($array as $key => $item) {
            if (array_key_exists($key, get_object_vars($this))) {
                $this->$key = is_numeric($item) ? (float) $item : $item;
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
        if (array_key_exists($properties, get_object_vars($this))) {
            return $this->$properties;
        }

        return false;
    }

    /**
     * Get or Has Cache
     */
    public function hasCache()
    {
        if (!Cache::has("{$this->to}-{$this->from}-{$this->amount}")) {
            return false;
        }

        return true;
    }

    /**
     * Create Cache
     */
    public function createCache($response)
    {
        return Cache::put("{$this->to}-{$this->from}-{$this->amount}", $response);
    }

    /**
     * Get Cache 
     */
    public function getCache()
    {
        return Cache::get("{$this->to}-{$this->from}-{$this->amount}");
    }

    /**
     * Delete Cache
     */
    public function removeCache()
    {
        return Cache::forget("{$this->to}-{$this->from}-{$this->amount}");
    }



    public function getConverter()
    {
        return (double) number_format(($this->amount * $this->quotation), '2', '.', '');
    }

    /**
     * Response
     */
    public function response()
    {
        return response()->json([
            'data' => [
                'to' => $this->to,
                'from' => $this->from,
                'amount' => $this->amount,
                'quotation' => $this->quotation,
                'converter' => $this->getConverter(),
            ],
            'meta' => [
                'message' => 'success',
                'errors' => []
            ]
        ], 200, ['Content-Type' => 'application/json']);
    }
}
