<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\CryptoCompare;
use App\Http\Requests\ApiRequest;

class ConverterCoinController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(ApiRequest $request)
    {
        $api = new CryptoCompare();
        $get = $api->params([
            'fsym' => $request->get('from'),
            'tsyms' => $request->get('to')
        ])->amount($request->get('amount'))
          ->request('price')
          ->response();

        return $get;
    }
}
