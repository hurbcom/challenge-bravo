<?php
namespace App\Services;

use App\Client\HurbClient;
use App\Libraries\FormatUtil;
use App\Models\Company;
use App\Models\ConvertCurrency;
use App\Models\ConvertCurrencyType;
use Carbon\Carbon;
use Exception;

class ConvertCurrencyService
{
    public function convert($from, $to, $amount){
        try{
            //Validar se os valires enviados para conversão são válidos
            if(!in_array($from, ConvertCurrencyType::AllowedTypesConvert)
            || !in_array($to, ConvertCurrencyType::AllowedTypesConvert)){
                throw new Exception("FROM/TO são inválidos");
            }

            $bidFrom = $this->convertToReal($from);
            $valorEmReal = $amount * $bidFrom;
            if($to == "BRL")
                return $valorEmReal;

            $bidTo = $this->convertToReal($to);
            $valorTo = $valorEmReal / $bidTo;

            return $valorTo;
        }catch (\Exception $e){
            \Log::error("ConvertCurrencyService::convert", ['error' => $e->getMessage()]);
            return $e->getMessage();
        }
    }

    public function convertToReal($code){
        date_default_timezone_set ("America/Sao_Paulo");
        $irApi = true;

        //Buscar a ultima consulta realizada na API
        $lastConvert = ConvertCurrency::where("code", $code)
            ->orderBy("create_date", "desc")
            ->first();
        if($lastConvert){
            $hoje = Carbon::now();
            $date = Carbon::createFromFormat("Y-m-d H:i:s", $lastConvert->create_date);
            if($date->format("Y-m-d") == $hoje->format("Y-m-d"))
                $irApi = false;
        }

        if($irApi){
            $hurbClient = new HurbClient();
            $value = $hurbClient->getCurrency($code);
            $returnApi = $value->$code;

            $lastConvert = new ConvertCurrency;
            $lastConvert->code = $returnApi->code;
            $lastConvert->bid = $returnApi->bid;
            $lastConvert->create_date = $returnApi->create_date;

            $lastConvert->save();
        }
        $bid = str_replace(",",".", $lastConvert->bid);
        return $bid;
    }

}