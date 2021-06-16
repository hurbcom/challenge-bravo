<?php
namespace App\Repository;

use Exception;
use Illuminate\Support\Facades\Http;

class CurrencyFreaksRepository 
{
    protected $api = "https://api.currencyfreaks.com/";
    protected $key = "9cfdfec302c645ebb5620bc1838fea0f";
    protected $endpoints = [
        "lastest" => "latest?apikey=",
    ];

    public function getLastestQuotations()
    {
        $url = $this->api . $this->endpoints["lastest"] . $this->key;
        $result = Http::get($url);
        if($result->successful()){
            return $result->json()["rates"];
        }
        
        throw new Exception("Falha ao obter cotação.", 400);
    }
    
}