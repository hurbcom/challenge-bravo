<?php 

namespace App\Repository;

use App\Currency;

class CurrencyRepository extends AbstractRepository
{
    public function validationRequestConvert($request) 
    {
        return $request->validate([
            'from'      => ['required', 'string', 'min:3', 'max:3'],
            'to'        => ['required', 'string', 'min:3', 'max:3'],
            'amount'    => ['required', 'numeric'],
        ]);
    }

    public function storeCurrency($request)
    {
        $currency = new Currency();
        $currency->name = $request->name;
        $currency->save();

        return true;
    }
}