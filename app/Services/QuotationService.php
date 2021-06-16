<?php
namespace App\Services;

use App\Repository\
{
    CurrencyRepository,
    CurrencyFreaksRepository,
    QuotationRepository,
};

use Exception;

class QuotationService 
{
    protected $quotationRepository;
    protected $currencyRepository;
    protected $currencyFreaksRepository;
    protected $now;
    
    public function __construct(
        CurrencyRepository $currencyRepository,
        CurrencyFreaksRepository $currencyFreaksRepository,
        QuotationRepository $quotationRepository
    )
    {
        $this->currencyRepository = $currencyRepository;
        $this->currencyFreaksRepository = $currencyFreaksRepository;
        $this->quotationRepository = $quotationRepository;
        $this->now = date("Y-m-d");
    }

    public function conversion(string $from, string $to, float $amount)
    {
        
        $lastroFrom = (float) $this->getLastroQuotation($from);
        
        $lastroTo = $this->getLastroQuotation($to);
        $baseValue =  $lastroTo/$lastroFrom;
        $finalValue = $baseValue*$amount;
       
        
        return number_format($finalValue,6);
        
    }


    public function getLastroQuotation(String $currency)
    {   
        try{
            $byDb = $this->getLatestQuotation($currency);
            if($byDb){
                return $byDb;
            }
            return $this->updateAll()[$currency];
        }catch(Exception $e){
            return new Exception($e->getMessage());
        }

    }

    private function getLatestQuotation($currency)
    {
        
        $where = [["st_short_name", "=", $currency]];
        $row = $this->currencyRepository->allByCondition(["latestQuotation"],1,$where);
        
        if(empty($row)){
            throw new Exception("Currency not found", 400);
        }
        
        
        if(!empty($row[0]->latestQuotation) && $row[0]->latestQuotation->fictional == true){
           
            $value = $row[0]->latestQuotation->value ?? false;
            return $value;
        }
       
        if(!empty($row[0]->latestQuotation->dt_quotation) && $row[0]->latestQuotation->dt_quotation == $this->now){
           
            $value = $row[0]->latestQuotation->value ?? false;
            return $value;
        }

        return false;
        
    }

    private function updateAll()
    {
        $currencies = [];
        $quotations = $this->currencyFreaksRepository->getLastestQuotations();
        $rows = $this->currencyRepository->all(["latestQuotation"]);
        foreach($rows as $currency){
            $currencyName = $currency->st_short_name;
            $value = $currency->latestQuotation->value ?? false;
            if(!empty($quotations[$currencyName])){
                $value = floatval($quotations[$currencyName]);
            }
            $currencies[$currencyName] = $value;
            $data = [
                "currency_id" => $currency->id,
                "dt_quotation" => $this->now,
                "value" => $value,
                "fictional" => false,
            ];
           
            if(empty($currency->latestQuotation->dt_quotation) || $currency->latestQuotation->dt_quotation != $this->now){
               
                $this->quotationRepository->create($data);
                continue;
            }
            if(empty($currency->latestQuotation->value)){
                echo 3;
                dd($currency);
            }
            if($currency->latestQuotation->value != $value){
                $this->quotationRepository->update($data,$currency->latestQuotation->id);
            }
        }


        return $currencies;
    }

    public function refresh()
    {
        return $this->updateAll();
    }
    

}