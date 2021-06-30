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

    private function getRates()
    {
        if ($this->redis->exists($this->from->name)) {
            return json_decode($this->redis->get($this->from->name));
        }
        $ratesFrom = $this->service->latest($this->from->name);
        if (!$ratesFrom) {
            return false;
        }
        $this->redis->setex($this->from->name, 300, json_encode($ratesFrom));
        return $ratesFrom;
    }

    public function get()
    {
        $ratesFrom = $this->getRates();
        if (!$ratesFrom) {
            $currencyFrom = (new Currency())->where('name', $this->from->name)->first();
            $this->from = new Currency(['name' => $currencyFrom->base]);
            $baseAmount = $this->get();
            return $baseAmount*$currencyFrom->baseRate;
        }

        if (!$ratesFrom->{strtolower($this->to->name)}) {
            $currencyTo = (new Currency())->where('name', $this->to->name)->first();
            $this->to = new Currency(['name' => $currencyTo->base]);
            $baseAmount = $this->get();
            return $baseAmount*$currencyTo->baseRate;
        }
    }

    private function getInCache($key)
    {
        if (!$this->redis->exists($key)) {
            return false;
        }
        $rates = json_decode($this->redis->get($key));

        $notFound = [];
        if (!isset($rates->{strtolower($this->from->name)})) {
            $notFound['error']['notFound']['from'] = $this->from->name;
        }

        if (!isset($rates->{strtolower($this->to->name)})) {
            $notFound['error']['notFound']['to'] = $this->to->name;
        }

        if (!empty($notFound)) {
            return ['success' => false]+$notFound;
        }

        return ['success' => true]+['data' => $this->exchange($rates->{strtolower($this->from->name)}, $rates->{strtolower($this->to->name)}, $this->amount)];
        print_r(['success' => true]+['data' => $this->exchange($rates->{strtolower($this->from->name)}, $rates->{strtolower($this->to->name)}, $this->amount)]);
        exit;

        return $this->exchange($rates->{strtolower($this->from->name)}, $rates->{strtolower($this->to->name)}, $this->amount);
    }

    private function storeInCache($key, $rates)
    {
        return $this->redis->set($key, json_encode($rates->usd));
    }

    private function exchange($from, $to, $amount)
    {
//        echo $from.'-'.$to.'-'.$amount;
        $base = $amount / $from;
        return sprintf('%.6f',$base*$to);
    }
}