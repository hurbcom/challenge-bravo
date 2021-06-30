<?php

namespace App\Models;

use App\Services\BaseService;

class ExchangeRate
{
    protected $service;
    protected $from;
    protected $to;
    protected $amount;
    protected $redis;

    public function __construct(BaseService $exangeService)
    {
        $this->redis = new \Redis();
        $this->redis->connect('hurb_redis', 6379);
        $this->service = $exangeService;
    }

    public function from(?Currency $currency)
    {
        if (!$currency instanceOf Currency) {
            throw new \Exception('Currency From Not Found');
        }
        $this->from = $currency;
        return $this;
    }

    public function to(?Currency $currency)
    {
        if (!$currency instanceOf Currency) {
            throw new \Exception('Currency To Not Found');
        }
        $this->to = $currency;
        return $this;
    }

    public function amount($ammount)
    {
        $this->amount = $ammount;
        return $this;
    }

    public function get()
    {
        if ($this->from->base != 'USD') {
            $baseAmount = $this->exchange($this->from->baseRate, 1, $this->amount);
            $this->from = (new Currency())->where('name', $this->from->base)->first();
            $this->amount = $baseAmount;
            return $this->get();
        }

        if ($this->to->base != 'USD') {
            $originalTo = $this->to;
            $this->to = (new Currency())->where('name', $this->to->base)->first();
            $baseAmount = $this->get();
            return $this->exchange(1, $originalTo->baseRate, $baseAmount);
        }

        $key = date('Ymd');
        $inCache = $this->getInCache($key);
        if ($inCache) {
            return $inCache;
        }

        $this->storeInCache($key, $rates = $this->service->latest());

        $fromNameLower = strtolower($this->from->name);
        $toNameLower = strtolower($this->to->name);
        return $this->exchange($rates->usd->$fromNameLower, $rates->usd->$toNameLower, $this->amount);
    }

    private function getInCache($key)
    {
        if (!$this->redis->exists($key)) {
            return false;
        }
        $rates = json_decode($this->redis->get($key));
        return $this->exchange($rates->{strtolower($this->from->name)}, $rates->{strtolower($this->to->name)}, $this->amount);
    }

    private function storeInCache($key, $rates)
    {
        return $this->redis->set($key, json_encode($rates->usd));
    }

    private function exchange($from, $to, $amount)
    {
        $base = $amount / $from;
        return sprintf('%.6f',$base*$to);
    }
}