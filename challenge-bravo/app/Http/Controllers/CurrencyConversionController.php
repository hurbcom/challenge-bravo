<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;

use App\Services\CurrencyConversionService;

class CurrencyConversionController extends Controller
{
    private $currencyConversor;

    public function  __construct(CurrencyConversionService $currencyConversor) {
        $this->currencyConversor = $currencyConversor;
    }

    public function convert(Request $request) {
        try {
            $from = $request->from;
            $to   = $request->to;
            $amount = $request->amount;
        
            $conversion = $this->currencyConversor->convert($amount, $from, $to);

            // Verifica se foi possivel realizar conversão
            if (!$conversion)
                return response()->json(["error" => "Error when trying to convert currencies"], 500);

            // Verifica se houve algum erro durante a conversão
            if (array_key_exists("error", $conversion))
                return response()->json(["error" => $conversion["error"]]);

            // resultado
            return response()->json([
                "data" => [
                    "process" => "currency_conversion",
                    "from"    => $from,
                    "to"      => $to,
                    "amount"  => $amount,
                    "result"  => number_format((float)$conversion["result"], 2, '.', '')
                ]
            ], 200);
        
        } catch (Exception $ex) {
            return response()->json(["error" => "Internal Server Error"], 500);
        } 
    }
}
