<?php

namespace App\Services;

use App\Models\Currency;
use Illuminate\Support\Facades\Redis;

class CurrencyApiService
{
    /**
     * Busca todas as moedas verdadeiras no banco
     */ 
    public function getAllRealCoinsDataBase()
    {
        $currencies = Currency::where('fake', 1)->get();
        return $currencies;
        
    }


    /**
     * Função que checa o valor atualizado das moedas existentes na api
     */ 

    public function updated($symbols = null)
    {      
        if($symbols == null) 
        {
            $currencies = $this->getAllRealCoinsDataBase(); 

            foreach($currencies as $currency)
            {
                $symbols = $symbols.','.$currency->acronym;
            }
        }       

        $req_url = "https://api.exchangerate.host/latest?symbols=$symbols";
        $response_json = file_get_contents($req_url);

        if(false !== $response_json) {
            try {
                $response = json_decode($response_json);

                if($response->success === true) {
                    return $response->rates;
                }

            } catch (\Exception $e) {
                return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }  
    }

    /**
     * Atualiza banco e redis 
     */

    public function automaticUpdate()
    {
        $updated = $this->updated(); 
  
        foreach($updated as $key=>$value){
            $data = ["amount" => $value];
            $currency = Currency::where('acronym', $key)->first();

            $currency->update($data);

            Redis::set($key, $value);

        }
        return $this->getAllRealCoinsDataBase();
    }
 

    /**
     * Função que converte o valor das moedas
     */ 
    public function convert($from, $to, $amount)
    {      
        try {
            $origin = Redis::get($from);
            $destiny = Redis::get($to);

            if(!$origin)
            {
                $origin = $this->getCurrencyForAcronymDataBase($from); 
            }

            if(!$destiny)
            {
                $destiny = $this->getCurrencyForAcronymDataBase($to); 
            }

            $calc = ($amount / $origin) * $destiny;  
            return json_decode($calc);            
        } catch (\Exception $e) {
            return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
    }

    /**
     * Função que confere se a moeda está no banco. Se não estiver ela é salva
     */ 
    public function getCurrencyForAcronymDataBase($acronym)
    { 
        $get = Currency::where('acronym', $acronym)->first();

        if($get){
            return $get->amount;
        }

        $currencies = $this->updated($acronym); 

        foreach($currencies as $key=>$value){
            $data = ["acronym" => $key, "amount" => $value, "fake" => 1];
            $currency = Currency::create($data);
            Redis::set($key, $value);
        }
        return $value;
    }


    /**
     * Função que checa moedas existentes na api
     */                 
    public function supported()
    {
        $req_url = 'https://api.exchangerate.host/symbols';
        $response_json = file_get_contents($req_url);
        if(false !== $response_json) {
            try {
                $response = json_decode($response_json);
                if($response->success === true) {
                    return $response->symbols;
                }
            } catch (\Exception $e) {
                return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
    }

    
}