<?php

namespace App\Helper;

use App\Models\Currency;

class SingleCurrency{

    /*
    Função para checar se determinada moeda é exitente no banco.
    */
    public function checkUniqueCurrency($request, $id)
    {        
        $checkAcronym = Currency::where('acronym', $request->acronym)
            ->where('id', '!=', $id)
            ->first();

        if($checkAcronym != null)
        {
            return 'Já existe uma moeda com essa sigla';
        }
        return false;
    }
}