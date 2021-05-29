<?php

require_once __DIR__ . "/ExceptionApi.class.php";
require_once __DIR__ . "/Currency.class.php";
require_once __DIR__ . "/../trait/Request.trait.php";

class Api
{
    use Request;

    function __construct($method)
    {
        header("Access-Control-Allow-Orgin: *");
        header("Access-Control-Allow-Methods: *");
        header('Content-type: application/json');

        $this->requestPayload();
        $this->requestValidate($method);
        $this->{$method}();
    }

    /**
     * convertCurrency
     * Converter moeda
     *
     * @author Eduardo Matias 
     * @return Json
     */
    public function convertCurrency()
    {

        $from = $this->request["from"];
        $to = $this->request["to"];
        $amount = $this->request["amount"];

        $currency = new Currency();
        $currency->getCurrency($from);
        $result = $currency->convertTo($to, $amount);

        echo json_encode([
            "from" => $from,
            "to" => $to,
            "amount" => $amount,
            "result" => $result
        ]);
    }

    /**
     * addCurrency
     * adicionar moeda
     *
     * @author Eduardo Matias 
     * @return Void
     */
    public function addCurrency()
    {
        $currency = new Currency($this->request);
        $currency->save();

        echo json_encode(["message" => "Moeda cadastrada com sucesso."]);
    }

    /**
     * removeCurrency
     * deletar moeda
     *
     * @author Eduardo Matias 
     * @return Void
     */
    public function removeCurrency()
    {
        $currency = new Currency();
        $currency->getCurrency($this->request['name']);
        $currency->remove();

        echo json_encode(["message" => "Moeda excluída com sucesso."]);
    }
}
