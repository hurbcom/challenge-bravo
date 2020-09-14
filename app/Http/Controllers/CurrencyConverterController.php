<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use App\Models\CurrencyConverter;

class CurrencyConverterController extends Controller
{
    /**
     * @param  string  $from
     * @param  string  $to
     * @param  double  $amount
     * @return double
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from' => 'required|string',
            'to' => 'required|string',
            'amount' => 'required|numeric'
        ], [
            'from.required' => 'Origin currency not informed',
            'from.string' => 'Origin currency invalid format',
            'from.size' => 'Origin currency need have 3 characters',
            'to.required' => 'Destiny currency not informed',
            'to.string' => 'Destiny currency invalid format',
            'to.size' => 'Destiny currency need have 3 characters',
            'amount.required'  => 'Amount not informed',
            'amount.numeric' => 'Amount invalid format',
        ]);

        if ($validator->fails()) {
            return json_encode($validator->messages()->first());
        }

        $from = strtoupper($request->from);
        $to = strtoupper($request->to);

        $key = $from . $to . $request->amount;
        $cacheConvertedValue = Cache::get($key);

        if ($cacheConvertedValue) {
            return $cacheConvertedValue;
        }

        $currencyConverter = new CurrencyConverter();
        $responseJson = $currencyConverter->getConvertedValue($from, $to, $request->amount);

        Cache::put($key, $responseJson, 300);

        return $responseJson;
    }
}
