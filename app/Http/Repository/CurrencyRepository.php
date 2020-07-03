<?php 

namespace App\Repository;

use App\Currency;
use Illuminate\Support\Facades\Http;

class CurrencyRepository extends AbstractRepository
{
    public function storeCurrency($request)
    {
        $currency = new Currency();
        $currency->name = $request->name;
        $currency->save();

        return true;
    }

    public function convert($request)
    {
        if($this->validationRequestConvert($request)) {
            $from = strtoupper($request->from);
            $to = strtoupper($request->to);
            $response = Http::timeout(3)
                            ->retry(2, 100)
                            ->get('https://api.exchangeratesapi.io/latest', [
                                'symbols'   => $to,
                                'base'      => $from,
            ]);

            if($response->successful()) {
                return response()->json(['rate' => $response['rates'][$to] * $request->amount]);
            } 

            return $response->throw()->json();
        }
    }

    private function validationRequestConvert($request) 
    {
        return $request->validate([
            'from'      => ['required', 'string', 'min:3', 'max:3'],
            'to'        => ['required', 'string', 'min:3', 'max:3'],
            'amount'    => ['required', 'numeric'],
        ]);
    }
}