<?php

namespace Hurb\Api\Http\Controllers\v1;

use Hurb\CurrencyConverter\ConverterInterface as Converter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller;

class ConverterController extends Controller
{
    /**
     * @var Converter
     */
    private $converter;

    /**
     * @param Converter $converter
     * @return void
     */
    public function __construct(Converter $converter)
    {
        $this->converter = $converter;
    }

    /**
     * Perform the input validation. If are all valid, converter service is invoked
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function convert(Request $request) : JsonResponse
    {
        $this->validate($request, [
            'from' => 'required|string|in:USD,BRL,BTC,ETH,EUR',
            'to' => 'required|string|in:USD,BRL,BTC,ETH,EUR',
            'amount' => 'required|numeric|min:0'
        ]);

        $from = $request->get('from');
        $to = $request->get('to');
        $amount = (float) $request->get('amount', 0);

        $result = $this->converter->convert($from, $to, $amount);

        return response()->json(['result' => $result]);
    }
}
