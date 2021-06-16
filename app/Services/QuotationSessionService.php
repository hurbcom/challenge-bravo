<?php
namespace App\Services;

use Illuminate\Http\Request;

class QuotationSessionService
{
    protected $name = "quotation";
    protected $session = null;
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->session = $this->getOrCreate();
    }

    public function getOrCreate()
    {
        $session = $this->request->session()->all();
        if(empty($session[$this->name])){
            return $this->create();
        }
        return $session;
    }

    public function create()
    {
        $this->request->session()->put($this->name, [
            "date" => date("Y-m-d"),
            "currency" => [],
        ]);
        return $this->request->session()->all();
    }

    public function sessionDateValidate()
    {
        if($this->session["date"] != date("Y-m-d")){
            return false;
        }
        return true;
    }

    public function getCurrency(String $currency)
    {
        if($this->sessionDateValidate()){
            return $this->session["currency"][$currency] ?? false;
        }
        return false;
    }

    public function getAllCurrency()
    {
        dd(true);
        if($this->sessionDateValidate()){
            return $this->session["currency"] ?? false;
        }
        return false;
    }

    public function setCurrency(String $currency, Float $value)
    {
        if(!$this->sessionDateValidate()){
            $this->create();   
        }

        $this->session["currency"][$currency] = $value;
        return $this;
    }

    public function setAllCurrencies(Array $currencies)
    {
        if(!$this->sessionDateValidate()){
            $this->create();   
        }

        $this->session["currency"] = $currencies;
        return $this;
    }

    public function clear()
    {
        return $this->create();
    }
}