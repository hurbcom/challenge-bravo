<?php

namespace App\Models;

use App\Services\BaseService;

class ExchangeRate
{
    protected $service;
    protected $from;
    protected $to;
    protected $amount;

    public function __construct(BaseService $exangeService)
    {
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
        if (!in_array($key, array_keys((array)$this->from->rates)) || !in_array($key, array_keys((array)$this->to->rates))) {
            $rates = $this->service->latest();
            foreach ((new Currency())->where('base', 'USD')->get() as $currency) {
                $nameLower = strtolower($currency->name);
                $usdRate = sprintf('%.6f',floatval($rates->usd->$nameLower));
                (new Currency())->where('_id', $currency->_id)->update(['rates.'.$key => $usdRate]);
            }

            $fromNameLower = strtolower($this->from->name);
            $toNameLower = strtolower($this->to->name);
            return $this->exchange($rates->usd->$fromNameLower, $rates->usd->$toNameLower, $this->amount);
        }

        return $this->exchange($this->from->rates->$key, $this->to->rates->$key, $this->amount);
    }

    private function exchange($from, $to, $amount)
    {
        $base = $amount / $from;
        return sprintf('%.6f',$base*$to);
    }
}