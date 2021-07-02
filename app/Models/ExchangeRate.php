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

    protected function getRates()
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
            return $this->getExchangeToUserCreatedCurrency($this->from, 'from');
        }

        if (!$ratesFrom->{strtolower($this->to->name)}) {
            return $this->getExchangeToUserCreatedCurrency($this->to, 'to');
        }

        return $this->response($ratesFrom->{strtolower($this->to->name)});
    }

    protected function getCurrencyByName($name)
    {
        $currency = (new Currency())->where('name', $name)->first();
        if (!$currency) {
            throw new \Exception('Currency '.$currency->name.' not found');
        }
        return $currency;
    }

    protected function getExchangeToUserCreatedCurrency(Currency $currency, $rateSearched)
    {
        $BdCurrency = $this->getCurrencyByName($currency->name);
        $baseAmount = $this->getBaseAmount($BdCurrency, $rateSearched);
        return $this->response($baseAmount*$BdCurrency->baseRate);
    }

    protected function getBaseAmount(Currency $currency, $rateSearched)
    {
        if ($rateSearched == 'from') {
            return (new ExchangeRate($this->service))
                ->from(new Currency(['name' => $currency->base]))
                ->to($this->to)
                ->amount(1)
                ->get()['data']['exchange'];
        }
        return (new ExchangeRate($this->service))
            ->from($this->from)
            ->to(new Currency(['name' => $currency->base]))
            ->amount(1)
            ->get()['data']['exchange'];
    }

    private function response($exchangeRate)
    {
        return [
            'status' => true,
            'data' => [
                'from' => $this->from->name,
                'to' => $this->to->name,
                'exchangeRate' => sprintf('%.6f',$exchangeRate),
                'amount' => sprintf('%.6f',$this->amount),
                'exchange' => sprintf('%.6f',$exchangeRate*$this->amount)
            ]
        ];
    }
}