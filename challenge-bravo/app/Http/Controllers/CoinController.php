<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Coin;
use App\Http\Requests\CoinRequest;
use Exception;

class CoinController extends Controller
{
    public function index() {
        $coins = Coin::all();

        return response()->json([
            "data" => $coins
        ], 200);
    }

    public function store(CoinRequest $request) {
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
                "error_msg" => "Error saving coin",
                "error_description" => $ex->getMessage()
            ]);
        }
    }

    public function update(CoinRequest $request, $id){
        try {
            $coinData = $request->all();
            $coin = Coin::findOrFail($id);
            $coin->update($coinData);

            return response()->json(["msg" => "Coin updated!"], 200);
        
        } catch(Exception $ex) {
            return response()->json([
                "error_msg" => "Error updating coin",
                "error_description" => $ex->getMessage()
            ]);
        }
    }

    public function show($id) {
        try {
            $coin = Coin::findOrFail($id);
            
            return response()->json([
                "data" => $coin
            ], 200);

        } catch (Exception $ex) {
            return response()->json([
                "error_msg" => "Error showing coin",
                "error_description" => $ex->getMessage()
            ]);
        }
    }

    public function delete($id) {
        try {
            $coin = Coin::findOrFail($id);
            $coin->delete();
            return response()->json([
                "msg" => "Coin Deleted!"
            ], 200);

        } catch (Exception $ex) {
            return response()->json([
                "error_msg" => "Error deleting coin",
                "error_description" => $ex->getMessage()
            ]);
        }
    }
}
