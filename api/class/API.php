<?php

class API {

    const LASTRO = "USD";

    private $method;

    public function __construct($method)
    {
        $this->method = $method;
    }

    public function process_request()
    {
        // $response = "";
        switch ($this->method)
        {
            case 'GET':
                $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
                $uri = explode('/', $uri);

                if (isset($uri[3]) && $uri[3] === "list")
                {
                    $response = $this->_list();
                }
                else
                {
                    $from = filter_input(INPUT_GET, 'from', FILTER_SANITIZE_URL);
                    $to = filter_input(INPUT_GET, 'to', FILTER_SANITIZE_URL);
                    $amount = filter_input(INPUT_GET, 'amount', FILTER_SANITIZE_URL);
                    $response = $this->_convert($from, $to, $amount);
                }


                break;
            case 'POST':
                $response = $this->_create();
                break;
            case 'DELETE':
                $response = $this->_delete();
                break;
            default:
                $response['success'] = FALSE;
                $response['body']['error_code'] = "405";
                $response['body']['error_message'] = "Metodo nao permitido";
                break;
        }

        return json_encode($response);
    }

    private function _convert($from, $to, $amount)
    {

        $fromRate = self::getCurrencyRate($from);
        $toRate = self::getCurrencyRate($to);

        if (is_null($fromRate) || is_null($toRate))
        {
            $response['success'] = FALSE;
            $response['body']['error_code'] = "404";
            $response['body']['error_message'] = "Moeda nao existe";
            return $response;
        }

        $result = $amount * $fromRate / $toRate;

        $response['success'] = TRUE;
        $response['body']['from'] = $from;
        $response['body']['to'] = $to;
        $response['body']['amount'] = $amount;
        $response['body']['rate'] = $result;
        return $response;
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
            return;
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

    private function _list()
    {
        return 'listagem';
    }

}
