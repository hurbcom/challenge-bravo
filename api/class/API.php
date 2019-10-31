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
                $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
                $uri = explode('/', $requestUri);

                if (isset($uri[3]) && $uri[3] === "list")
                {
                    $response = $this->_list();
                }
                else
                {
                    $from = strtoupper(filter_input(INPUT_GET, 'from', FILTER_SANITIZE_URL));
                    $to = strtoupper(filter_input(INPUT_GET, 'to', FILTER_SANITIZE_URL));
                    $amount = filter_input(INPUT_GET, 'amount', FILTER_SANITIZE_URL);
                    $response = $this->_convert($from, $to, $amount);
                }


                break;
            case 'POST':
                $input = (array) json_decode(file_get_contents('php://input'), TRUE);
                $response = $this->_create($input);
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

        $fromRate = round(self::getCurrencyRate($from),7);
        $toRate = round(self::getCurrencyRate($to),7);

        if (is_null($from) || $from === "")
        {
            $response['success'] = FALSE;
            $response['body']['error_code'] = "400";
            $response['body']['error_message'] = "Moeda 'from' nao informada.";
            return $response;
        }

        if (is_null($to) || $to === "")
        {
            $response['success'] = FALSE;
            $response['body']['error_code'] = "400";
            $response['body']['error_message'] = "Moeda 'to' nao informada.";
            return $response;
        }

        if (is_null($fromRate) || is_null($toRate))
        {
            $response['success'] = FALSE;
            $response['body']['error_code'] = "400";
            $response['body']['error_message'] = "Moeda nao suportada pela API.";
            return $response;
        }

        if (is_null($amount))
        {
            $response['success'] = FALSE;
            $response['body']['error_code'] = "400";
            $response['body']['error_message'] = "Valor nao informado.";
            return $response;
        }


        $result = $amount * ( $toRate / $fromRate );

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
            return round(1/$result[0]['current_price'],7);
        }
        else
        {
            $result = $cHTTPCurrency->makeRequest(FALSE);
            
            return round($result[strtolower($code)]['rate'],7);
        }
    }

    private function _create($input)
    {
        $cCurrency = new Currency();

        $code = isset($input["code"]) ? (trim($input["code"])) : NULL;
        $name = isset($input["name"]) ? (trim($input["name"])) : NULL;
        $is_crypto = isset($input["is_crypto"]) ? (trim($input["is_crypto"])) : 0;

        if (!$cCurrency->create($code, $name, $is_crypto))
        {
            $response['success'] = FALSE;
            $response['body']['error_code'] = "400";
            $response['body']['error_message'] = "Erro ao adicionar moeda.";
            return $response;
        }


        $response['success'] = TRUE;
        $response['body']['code'] = $code;
        $response['body']['name'] = $name;
        $response['body']['is_crypto'] = $is_crypto;
        return $response;
    }

    private function _delete()
    {
        $cCurrency = new Currency();
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode('/', $requestUri);

        if (!isset($uri[3]))
        {
            $response['success'] = FALSE;
            $response['body']['error_code'] = "404";
            $response['body']['error_message'] = "Moeda nao encontrada.";
            return $response;
        }

        if (!$cCurrency->delete($uri[3]))
        {
            $response['success'] = FALSE;
            $response['body']['error_code'] = "400";
            $response['body']['error_message'] = "Erro ao excluir moeda.";
            return $response;
        }

        $response['success'] = TRUE;
        $response['body']['code'] = $uri[3];
        return $response;
    }

    private function _list()
    {
        $cCurrency = new Currency();
        return $cCurrency->getAll();
    }

}
