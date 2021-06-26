<?php

namespace App;

use App\Services\ExangeService;

class ExchangeRatesController extends Controller
{
    public function index()
    {
        print_r((new ExangeService())->latest());
        echo 'dsa';
    }
}