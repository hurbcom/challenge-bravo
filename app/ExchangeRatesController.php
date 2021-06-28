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
        $currencies = (new Currency())
            ->whereIn('name', [$this->request->from, $this->request->to])
            ->get();

        $currencyFrom = $currencies[0];
        $currencyTo = $currencies[1];

        /*
         * Se currencies[0] for o from inverte as variáveis
         */
        if ($currencies[1]->name == $this->request->from) {
            $currencyFrom = $currencies[1];
            $currencyTo = $currencies[0];
        }

        $convert = $this->model->from($currencyFrom)
            ->to($currencyTo)
            ->amount($this->request->amount)
            ->get();
        echo $convert;
    }
}