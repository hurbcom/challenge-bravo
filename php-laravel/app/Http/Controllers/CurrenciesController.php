<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

use App\Models\Currency;

class CurrenciesController extends Controller
{
    function listAll()
    {
        try {
            $cache = Redis::get('ALL_CURRENCIES');

            $data = null;
            if (isset($cache)) {
                $data = $cache;
            } else {
                $data = Currency::get();
            }

            return response()->json(json_decode($data), 200);
        } catch (\Throwable $th) {
            error_log($th);
            return response(null, 500);
        }
    }

    function newCurrency(Request $req)
    {
        try {
            $currency = new Currency();
            $currency->code = strtoupper($req->code);
            $currency->bid = $req->bid;
            $currency->save();

            $allData = Currency::get();
            Redis::set('ALL_CURRENCIES', json_encode($allData));

            return response(null, 201);
        } catch (\Throwable $th) {
            error_log($th);
            return response($th, 500);
        }
    }

    function getByCode($code)
    {
        $code = strtoupper($code);

        try {
            $cacheKey = $code.'_CURRENCY';
            $cache = Redis::get($cacheKey);

            $data = null;
            if (isset($cache) && ($cache != 'null' && $cache)) {
                $data = $cache;
            } else {
                $data = Currency::where('code', $code)->first();
                Redis::set($cacheKey, json_encode($data));
            }

            return response()->json(json_decode($data), 200);
        } catch (\Throwable $th) {
            error_log($th);
            return response(null, 500);
        }
    }

    function remove($code)
    {
        try {
            $currency = Currency::where('code', strtoupper($code));
            $currency->delete();
            Redis::set(strtoupper($code).'_CURRENCY', null);

            $allData = Currency::get();
            Redis::set('ALL_CURRENCIES', json_encode($allData));

            return response(null, 200);
        } catch (\Throwable $th) {
            error_log($th);
            return response($th, 500);
        }
    }

    function convertCurrency(Request $req)
    {
        try {
            $cache = Redis::get('ALL_CURRENCIES');

            $currencies = null;
            if (isset($cache)) {
                $currencies = json_decode($cache);
            } else {
                $currencies = Currency::get();
            }

            $cc = array_filter($currencies, function($c) use ($req) {
                return $c->code == strtoupper($req->from) ||
                        $c->code == strtoupper($req->to);
            });

            $cc = array_values($cc);

            $fromCurrency = $cc[0];
            $toCurrency = $cc[1];

            $fromBID = $fromCurrency->bid;
            $toBID = $toCurrency->bid;

            $bid = (((1 / $toBID) / (1 / $fromBID)) * $req->amount);

            return response()->json([
                'from' => $req->from,
                'to' => $req->to,
                'amount' => $req->amount,
                'bid' => number_format($bid, 2),
            ], 200);
        } catch (\Throwable $th) {
            error_log($th);
            return response(null, 500);
        }
    }
}
