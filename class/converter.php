<?php

// define uma constante com as moedas válidas e com seus respectivos valores de cotação
define("COIN_ARRAY", ['USD' => [3.97], 'BRL' => [1], 'EUR' => [4.43], 'BTC' => [44099.98], 'ETH' => [821.44]]);
// cotação feita no dia 13/08/2019

class Conversor {

    private $value;

    //get do valor
    function getValue() {
        return $this->value;
    }

    // set do valor
    function setValue($value) {
        $this->value = $value;
    }

    // validação dos valores passados com as moedas setadas na constante
    function validaMoeda($moeda) {
        return array_key_exists($moeda, COIN_ARRAY);
    }

    // converte o valor para real em cima da moeda que foi passada como from
    function converter2Real ($from) {
        return (float)$this->value * (float)COIN_ARRAY[$from][0];
    }

    // converte o valor de real para a moeda que foi passada como to
    function converterReal2To ($to, $valueInReal) {
        return (float)$valueInReal / (float)COIN_ARRAY[$to][0];
    }

    // adiciona no valor final, o símbolo da moeda que retornará no return da api
    function addMoneySymbol ($finalValue, $to) {
        switch ($to) {
            case "USD":
                return '$ ' . number_format($finalValue, 2, '.', ',');
            case "BRL":
                return 'R$ ' . number_format($finalValue, 2, ',', '.');
            case "EUR":
                return 'EUR ' . number_format($finalValue, 2, ',', '.');;
            case "BTC":
                return 'Bitcoins ' . number_format($finalValue, 2, ',', '.');
            case "ETH":
                return 'Ethers ' . number_format($finalValue, 2, ',', '.');
        }
    }
}