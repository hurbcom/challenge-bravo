<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Coin;
use Exception;

class CoinController extends Controller
{
    public function index() {
        $coins = Coin::all();
        
        return response()->json([
            "data" => $coins
        ], 200);
    }

    public function store(Request $request) {
        try {
            $coin = new Coin;
            $coin->name = $request->name;
            $coin->code = strtoupper($request->code);
            $coin->dolarValue = number_format((float)$request->dolarValue, 2, '.', '');
            $coin->save();

            return response()->json([
                "msg" => "Coin saved!"
            ]);

        } catch (Exception $ex) {
            return response()->json([
                "error" => "Error saving coin"
            ]);
        }

    }
}
