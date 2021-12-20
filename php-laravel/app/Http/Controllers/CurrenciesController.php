<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use SebastianBergmann\Environment\Console;

use App\Models\Currency;

class CurrenciesController extends Controller
{
    function listAll() {
        $cache = Redis::get('ALL_CURRENCIES');
        error_log($cache);
        return $cache;
        $res = Currency::get();
        return $res;
    }

    function newCurrency() {
        return true;
    }

    function getByCode($code) {
        $res = Currency::where('code', '=', strtoupper($code))
            ->get();
        if(count($res) <= 0) return null;
        else return $res[0];
    }

    function remove($code) {
        return true;
    }

    function convert() {
        return true;
    }
}
