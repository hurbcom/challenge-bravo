<?php

class API {

    const LASTRO = "USD";

    private $method;

    public function __construct($method)
    {
        $this->method = $method;
        $this->currency = new Currency();
    }

    public function process_request()
    {
        switch ($this->method)
        {
            case 'GET':
                $response = $this->_convert("USD", "ETH", 500);
                break;
            case 'POST':
                $response = $this->_create();
                break;
            case 'DELETE':
                $response = $this->_delete();
                break;
            default:
                $response = 'metodo nao permitido';
                break;
        }

        if ($response)
        {
            echo $response;
        }
    }

    private function _convert($from, $to, $amount)
    {

        $fromRate = 1;
        $toRate = 1;




        $fromRate = self::getCurrencyRate($from);
        $toRate = self::getCurrencyRate($to);

        $result = $amount * $fromRate / $toRate;


        return $result;

    }

    function getCurrency($code)
    {
        $cCurrency = new Currency();
        return $cCurrency->get($code);
    }

    function getCurrencyRate($code)
    {

        $cHTTPCurrency = new HTTPCurrency();

        $currency = self::getCurrency($code);
        if (!$currency)
        {
            return "n vale";
        }


        if ($code === self::LASTRO)
        {
            return 1;
        }

        if ($currency['is_crypto'])
        {
            $result = $cHTTPCurrency->makeRequest(TRUE, $currency['name']);
            return $result[0]['current_price'];
        }
        else
        {
            $result = $cHTTPCurrency->makeRequest(FALSE);
            return $result[strtolower($code)]['rate'];
        }
    }

    private function _create()
    {
        return 'criado';
    }

    private function _delete()
    {
        return 'excluido';
    }

}
