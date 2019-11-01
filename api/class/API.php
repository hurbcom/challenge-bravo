<?php

/**
 * API Class
 *
 * Does all the requests based on the method called
 *
 */
class API {

    /** @var string Base Currency */
    const LASTRO = "USD";

    /**
     * Checks and returns the request in json format.
     *
     * @param	string $method Method requested.
     * @return	json API response for the request.
     */
    public function process_request($method)
    {
        switch ($method)
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

    /**
     * Internal method used to convert an amount from one currency to another.
     *
     * @param	string $from From currency.
     * @param	string $to to currency.
     * @param	string $amount amount to be converted.
     * @return	json response for the conversion.
     */
    private function _convert($from, $to, $amount)
    {
        $fromRate = $this->_getCurrencyRate($from);
        $toRate = $this->_getCurrencyRate($to);

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

        if (is_null($amount) || $amount <= 0)
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
        $success['result'] = $result;
        $response = $this->_createResponse(TRUE, $success);
        return $response;
    }

    /**
     * Gets a currency.
     *
     * @param	string $code Currency code.
     * @return	mixed
     */
    private function _getCurrency($code)
    {
        $cCurrency = new Currency();
        return $cCurrency->get($code);
    }

    /**
     * Gets the rate of a currency.
     *
     * @param	string $code Currency code.
     * @return	mixed
     */
    private function _getCurrencyRate($code)
    {
        $cHTTPCurrency = new HTTPCurrency();
        $currency = $this->_getCurrency($code);
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
            //note: returning a cryptocurrency, the rate has to be inverted (1/rate)
            return round(1 / $result[0]['current_price'], 7);
        }
        else
        {
            $result = $cHTTPCurrency->makeRequest(FALSE);
            return round($result[strtolower($code)]['rate'], 7);
        }
    }

    /**
     * Internal method to add a currency on the system.
     *
     * @param	array $input Array containing the data to be created .
     * @return	json response of the operation.
     */
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

    /**
     * Internal method to delete a currency on the system.
     *
     * @return	json response of the operation.
     */
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

        if ($cCurrency->delete($uri[3]) === FALSE)
        {
            $error['error_code'] = 400;
            $error['error_message'] = "Erro ao excluir moeda.";
            $response = $this->_createResponse(FALSE, $error);
            return $response;
        }

        $success = TRUE;
        $success['code'] = $uri[3];
        $response = $this->_createResponse(TRUE, $success);
        return $response;
    }

    /**
     * Internal method to list all supported currencies.
     *
     * @return	mixed.
     */
    private function _list()
    {
        $cCurrency = new Currency();
        $list = $cCurrency->getAll();
        if ($list === FALSE)
        {
            $error['error_code'] = 400;
            $error['error_message'] = "Nenhuma moeda encontrada.";
            $response = $this->_createResponse(FALSE, $error);
        }
        
        $success['currencies'] = $list;
        $response = $this->_createResponse(TRUE, $success);
        return $response;
    }

    /**
     * Internal method to create a response.
     *
     * @return	json Encoded json of a response.
     */
    private function _createResponse($success, $body)
    {
        $response['success'] = $success;
        $response['body'] = $body;
        return json_encode($response);
    }

}
