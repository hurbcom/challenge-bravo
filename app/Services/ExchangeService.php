<?php

namespace App\Services;

class ExangeService extends BaseService
{
    protected $baseUrl = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/';

    public function latest()
    {
        $response = $this->request('GET', 'usd.json');
        return $response;
    }
}