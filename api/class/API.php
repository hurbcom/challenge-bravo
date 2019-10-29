<?php

class API {

    private $method;

    public function __construct($method)
    {
        $this->method = $method;
    }

    public function process_request()
    {
        switch ($this->method)
        {
            case 'GET':
                $response = $this->_convert("USD", "BRL", 500);
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
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);

        return $output;
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
