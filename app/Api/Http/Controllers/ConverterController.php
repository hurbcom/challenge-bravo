<?php
/**
 * Created by PhpStorm.
 * User: jorge-jr
 * Date: 29/08/18
 * Time: 22:50
 */

namespace App\Api\Http\Controllers;


use App\Domains\Currency\Converter\Convert;
use App\Domains\Currency\Requests\ConverterRequest;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class ConverterController extends BaseController
{
    public function runConversion(Convert $convert,Request $request) : JsonResponse{

        $currencies = env('AVAILABLE_CURRENCIES');

        $rules = [
            'from'      => 'required|alpha|size:3|in:' . $currencies, // alpha chars, must have 3 chars in USD,BRL,EUR,BTC,ETH
            'to'        => 'required|alpha|size:3|in:' . $currencies,
            'amount'    => 'required|regex:^[-+]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$^' //2 decimal float regex
        ];

        $messages = [
            'required'  => 'The :attribute parameter is required.',
            'alpha'     => 'The :attribute parameter should contain only alpha characters.',
            'size'      => 'The :attribute must be exactly :size.',
            'in'        => 'The :attribute must be one of the following types: :values',
            'regex'     => 'The :attribute must be float with 2 decimals',
        ];

        //request validation
        $this->validate($request, $rules, $messages);



        return $convert->run($request);
    }
}