<?php

/**
 * Request
 */
trait Request
{

    protected $request;

    /**
     * requestPayload
     *
     * @author Eduardo Matias 
     * @return Void
     */
    protected function requestPayload()
    {
        $request = file_get_contents('php://input');
        $request = (is_array($request)) ? $request : (array)json_decode($request, true);
        $request += $_REQUEST;
        $this->request = $request;
    }

    /**
     * requestValidate
     * valida a request de acordo com o método informado
     * todo novo método deve ter o requestValidate implementado.
     * Ex.: requestValidateNewMethod
     *
     * @author Eduardo Matias 
     * @return Void|throw ExceptionApi
     */
    protected function requestValidate($method)
    {
        $methodValidate = "requestValidate" . ucfirst($method);
        if (!method_exists($this, $methodValidate)) {
            throw new ExceptionApi("O método $methodValidate deve ser implementado na trait Request.trait.php", 500);
        }
        $this->{$methodValidate}();
    }

    /**
     * prepareRequest
     * apenas campos permitidos
     *
     * @author Eduardo Matias 
     * @return Array
     */
    protected function prepareRequest(array $request, array $fields)
    {
        $prepareRequest = [];
        foreach ($request as $key => $value) {
            if (in_array($key, $fields)) {
                $prepareRequest[$key] = urldecode($value);
            }
        }
        return $request = $prepareRequest;
    }

    /**
     * requestValidateConvertCurrency
     */
    private function requestValidateConvertCurrency()
    {
        // valida atributos
        if (!$this->request || empty($this->request['from']) || empty($this->request['to']) || empty($this->request['amount'])) {
            throw new ExceptionApi('Formato inválido. Ex.: ?from=BTC&to=EUR&amount=123.45', 400);
        }
        // valida valor
        if (!is_numeric($this->request['amount']) || $this->request['amount'] <= 0) {
            throw new ExceptionApi('Formato inválido, o atributo amount deve conter um valor numérico maior que zero.', 400);
        }
    }

    /**
     * requestValidateAddCurrency
     */
    private function requestValidateAddCurrency()
    {
        // valida atributos
        if (!$this->request || empty($this->request['name'])  || empty($this->request['amount'])) {
            throw new ExceptionApi('Formato inválido. Ex.: {"name": "BTC", "amount": 39006.37}', 400);
        }
        // valida valor
        if (!is_numeric($this->request['amount']) || $this->request['amount'] <= 0) {
            throw new ExceptionApi('Formato inválido, o atributo amount deve conter um valor numérico maior que zero.', 400);
        }
    }

    /**
     * requestValidateRemoveCurrency
     */
    private function requestValidateRemoveCurrency()
    {
        // valida atributos
        if (!$this->request || empty($this->request['name'])) {
            throw new ExceptionApi('Formato inválido. Ex.: {"name": "BTC"}', 400);
        }
    }
}
