<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Currency;
use SebastianBergmann\Environment\Console;

class CurrenciesController extends Controller
{
    function listAll() {
        $res = Currency::get(['code', 'bid', 'updatedAt']);
        return $res;
    }

    function newCurrency() {
        return true;
    }

    function getByCode($code) {
        $res = Currency::where('code', '=', strtoupper($code))
            ->get(['code', 'bid', 'updatedAt']);
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
