<?php

namespace App\Services;

class ExchangeService extends BaseService
{
    protected $baseUrl = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/';

    public function latest($currency='usd')
    {
        $response = $this->request('GET', strtolower($currency).'.json');
        return $response->{strtolower($currency)};
    }

    public function exchange($from, $to)
    {
        $response = $this->request('GET', strtolower($from).'/'.strtolower($to).'.json');
        return $response;
    }
}