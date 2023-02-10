<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Client;

class CurrencyConversionService {

    private string $currencyConversionAPIEnpoint = "https://economia.awesomeapi.com.br/last/";
    const AVALIABLE_CURRENCIES = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];
    const BACKING_CURRENCY = "USD";
     
    /**
     * Conversor de moedas usando o valor em  dolar como o lastro
     *
     * @param float $amount -> valor a ser convertido
     * @param string $from  -> moeda de origem
     * @param string $to    -> moeda destino
     * 
     * @return array -> resultado da operação e mensagem de error (caso exista)
     */
    public function convert(float $amount, string $from, string $to) {
        try {

            // Verifica se moeda origem e moeda está contida no array de moedas disponiveis
            if (!in_array($to, CurrencyConversionService::AVALIABLE_CURRENCIES))
                return ["error" => "Coin $to doesn't avaliable"];

            if (!in_array($from, CurrencyConversionService::AVALIABLE_CURRENCIES))
                return ["error" => "Coin $from doesn't avaliable"];

            // faz request para a API de conversão
            $client = new Client();
            
            // Converte valor unitário da moeda origem para dolar
            $fromCurrency = '';
            if ($from == 'USD') {
                $fromCurrency = $client->get($this->currencyConversionAPIEnpoint . CurrencyConversionService::BACKING_CURRENCY);
            } else {
                $fromCurrency = $client->get($this->currencyConversionAPIEnpoint . $from . "-" . CurrencyConversionService::BACKING_CURRENCY);                
            }
            $fromCurrency = json_decode($fromCurrency->getBody(), true);
            $fromCurrencyUSDValue = $fromCurrency[$from . CurrencyConversionService::BACKING_CURRENCY]["ask"];

            // Converte valor unitário da moeda destino para dolar
            $toCurrency = '';
            if ($to == 'USD') {
                $toCurrency = $client->get(CurrencyConversionService::BACKING_CURRENCY);
            } else {
                $toCurrency = $client->get($this->currencyConversionAPIEnpoint . $to . "-" . CurrencyConversionService::BACKING_CURRENCY);
            }
            $toCurrency = json_decode($toCurrency->getBody(), true);
            $toCurrencyUSDValue = $toCurrency[$to . CurrencyConversionService::BACKING_CURRENCY]["ask"];

            // faz o calculo de conversão das moedas usando o valor delas em dolar como lastro
            $resultConversion = ($amount * $fromCurrencyUSDValue) / $toCurrencyUSDValue;
            
            return [
                "result" => $resultConversion
            ];

        } catch (Exception $ex) {
            return false;
        }
    }

}