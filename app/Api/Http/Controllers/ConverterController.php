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


        //request validation
        $this->validate($request, [
           'from' => 'required|alpha|size:3|in:USD,BRL,EUR,BTC,ETH', // alpha chars, must have 3 chars in USD,BRL,EUR,BTC,ETH
            'to' => 'required|alpha|size:3|in:USD,BRL,EUR,BTC,ETH',
            'amount' => 'required|regex:^[-+]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$^' //2 decimal float regex
        ]);

        return $convert->run($request);
    }
}