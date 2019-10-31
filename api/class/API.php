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
                $error['error_code'] = 405;
                $error['error_message'] = "Metodo nao permitido";
                $response = $this->_createResponse(FALSE, $error);
                break;
        }

        return $response;
    }

    private function _convert($from, $to, $amount)
    {
        $fromRate = $this->getCurrencyRate($from);
        $toRate = $this->getCurrencyRate($to);

        if (is_null($from) || $from === "")
        {
            $error['error_code'] = 400;
            $error['error_message'] = "Moeda 'from' nao informada.";
            $response = $this->_createResponse(FALSE, $error);
            return $response;
        }

        if (is_null($to) || $to === "")
        {
            $error['error_code'] = 400;
            $error['error_message'] = "Moeda 'to' nao informada.";
            $response = $this->_createResponse(FALSE, $error);
            return $response;
        }

        if (is_null($fromRate) || is_null($toRate))
        {
            $error['error_code'] = 400;
            $error['error_message'] = "Moeda nao suportada pela API.";
            $response = $this->_createResponse(FALSE, $error);
            return $response;
        }

        if (is_null($amount) || $amount <=0)
        {
            $error['error_code'] = 400;
            $error['error_message'] = "Valor nao informado.";
            $response = $this->_createResponse(FALSE, $error);
            return $response;
        }

        $result = $amount * ( $toRate / $fromRate );

        $success['from'] = $from;
        $success['to'] = $to;
        $success['amount'] = $amount;
        $success['rate'] = $result;
        $response = $this->_createResponse(TRUE, $success);
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
        $currency = $this->getCurrency($code);
        if (is_null($currency) || $currency === FALSE)
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
            return round(1 / $result[0]['current_price'], 7);
        }
        else
        {
            $result = $cHTTPCurrency->makeRequest(FALSE);
            return round($result[strtolower($code)]['rate'], 7);
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
            $error['error_code'] = 400;
            $error['error_message'] = "Erro ao adicionar moeda.";
            $response = $this->_createResponse(FALSE, $error);
            return $response;
        }

        $success = TRUE;
        $success['code'] = $code;
        $success['name'] = $name;
        $success['is_crypto'] = $is_crypto;
        $response = $this->_createResponse(TRUE, $success);

        return $response;
    }

    private function _delete()
    {
        $cCurrency = new Currency();
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode('/', $requestUri);

        if (!isset($uri[3]))
        {


            $error['error_code'] = 404;
            $error['error_message'] = "Moeda nao encontrada.";
            $response = $this->_createResponse(FALSE, $error);
            return $response;
        }

        if (!$cCurrency->delete($uri[3]))
        {
            $error['error_code'] = 400;
            $error['error_message'] = "Erro ao excluir moeda.";
            $response = $this->_createResponse(FALSE, $error);
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

    private function _createResponse($success, $body)
    {
        $response['success'] = $success;
        $response['body'] = $body;
        return json_encode($response);
    }

}
