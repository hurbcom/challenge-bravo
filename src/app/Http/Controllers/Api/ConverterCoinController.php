<?php

namespace App\Http\Controllers\Api;

use App\ConverterCoin;
use App\Http\Controllers\Controller;
use App\Services\CryptoCompare;
use App\Http\Requests\ApiRequest;

class ConverterCoinController extends Controller
{
    protected $lifeTimeCache = 60;
    protected $api;
    protected $converter;

    public function __construct()
    {
        $this->api = new CryptoCompare();
        $this->converter = new ConverterCoin();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(ApiRequest $request)
    {
        $this->converter->hydrate($request->all());

        if (!$this->converter->hasCache()) {
            $quotation = $this->api->params([
                'fsym' => $this->converter->get('from'),
                'tsyms' => $this->converter->get('to')
            ])->amount($this->converter->get('amount'))
                ->request('price')->response();

            $this->converter->hydrate([
                'quotation' => $quotation
            ]);

            $result = $this->converter->response();

            $this->converter->createCache($result);
        }

        return $this->converter->getCache();
    }
}
