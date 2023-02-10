<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\CurrencyConversionService;

class CurrencyConversionController extends Controller
{
    private $currencyConversor;

    public function  __construct(CurrencyConversionService $currencyConversor) {
        $this->currencyConversor = $currencyConversor;
    }

    public function convert(Request $request) {
        $from = $request->from;
        $to   = $request->to;
        $amount = $request->amount;
    
        $this->currencyConversor->convert($amount, $from, $to);

        return response()->json(["ok"]);
    }
}
