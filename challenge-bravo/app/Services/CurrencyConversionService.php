<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Client;

use App\Models\Coin;

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
            // Recupera as moedas do banco de dados e complementa na lista das disponiveis
            $allPersonalCurrencies = Coin::pluck('code')->toArray();
            $allAvaliablesCurrencyCode = array_merge($allPersonalCurrencies, CurrencyConversionService::AVALIABLE_CURRENCIES);

            // Verifica se moeda origem e moeda está contida no array de moedas disponiveis
            if (!in_array($to, $allAvaliablesCurrencyCode))
                return ["error" => "Coin $to doesn't avaliable"];

            if (!in_array($from, $allAvaliablesCurrencyCode))
                return ["error" => "Coin $from doesn't avaliable"];

            // faz request para a API de conversão
            $client = new Client();
            
            // Converte valor unitário da moeda origem para dolar
            $fromCurrencyUSDValue = 0;
            // caso seja uma moeda real, pega o valor em dolar da API
            if(!in_array($from, $allPersonalCurrencies)) {
                $fromCurrency = '';
                if ($from == 'USD') {
                    $fromCurrency = $client->get($this->currencyConversionAPIEnpoint . CurrencyConversionService::BACKING_CURRENCY);
                } else {
                    $fromCurrency = $client->get($this->currencyConversionAPIEnpoint . $from . "-" . CurrencyConversionService::BACKING_CURRENCY);                
                }
                $fromCurrency = json_decode($fromCurrency->getBody(), true);
                $fromCurrencyUSDValue = $fromCurrency[$from . CurrencyConversionService::BACKING_CURRENCY]["ask"];
            } else {
                // caso não seja uma moeda real, pega o valor do banco
                $fromCurrencyUSDValue = Coin::where('code', $from)->value('dolarValue');
            }

            // Converte valor unitário da moeda destino para dolar
            $toCurrencyUSDValue = 0;
            // caso seja uma moeda real, pega o valor em dolar da API
            if (!in_array($to, $allPersonalCurrencies)) {
                $toCurrency = '';
                if ($to == 'USD') {
                    $toCurrency = $client->get(CurrencyConversionService::BACKING_CURRENCY);
                } else {
                    $toCurrency = $client->get($this->currencyConversionAPIEnpoint . $to . "-" . CurrencyConversionService::BACKING_CURRENCY);
                }
                $toCurrency = json_decode($toCurrency->getBody(), true);
                $toCurrencyUSDValue = $toCurrency[$to . CurrencyConversionService::BACKING_CURRENCY]["ask"];
            } else {
                // caso não seja uma moeda real, pega o valor do banco
                $toCurrencyUSDValue = Coin::where('code', $to)->value('dolarValue');
            }
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