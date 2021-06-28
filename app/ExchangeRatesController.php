<?php

namespace App;

use App\Models\ExchangeRate;
use App\Models\Currency;
use App\Services\ExchangeService;
use Src\Request;

class ExchangeRatesController extends Controller
{
    public function __construct(Request $request)
    {
        $this->model = new ExchangeRate(new ExchangeService());
        parent::__construct($request);
    }

    public function index()
    {
        echo 'dsa';exit;
//        $currencies = (new Currency())
//            ->whereIn('name', [$this->request->from, $this->request->to])
//            ->get();
//
//        foreach ($this->request->all(['from', 'to']) as $param => $currName) {
//            if ($currencies[0]->name == $currName) {
//
//            }
//        }
//
//        print_r($this->request->all(['from', 'to']));
//
//        exit;

        $currencyFrom = (new Currency())
            ->where('name', $this->request->from)
            ->first();

        $currencyTo = (new Currency())
            ->where('name', $this->request->to)
            ->first();

        $convert = $this->model->from($currencyFrom)
            ->to($currencyTo)
            ->amount($this->request->amount)
            ->get();
        echo $convert;
    }
}