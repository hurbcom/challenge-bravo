<?php

namespace App\Http\Controllers\Awesame;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TaxasController extends Controller
{
    public $percentual;

    public $moeda;

    public $moedaEstrangeira;


    public const VALOR_MIN_COMPRA = 1000;

    public const VALOR_MAX_COMPRA = 100000;

    protected const VALOR_CONVERSAO = 3000;


    public function stopRunning($currentBalance)
    {
        if ($currentBalance >= self::VALOR_MAX_COMPRA) {
            return redirect()->back()->withErrors(['errors_max' => 'O valor da compra deve ser menor que 100.000,00 BRL ']);
        } else if ($currentBalance <= self::VALOR_MIN_COMPRA) {
            return redirect()->back()->withErrors(['errors_min' => 'O valor da compra deve ser superior a 1.000,00 BRL']);
        }
    }

    /**
     * retorna a taxa de acordo com o tipo de pagamento
     * @param string
     *
     * @return $taxa
     */
    public function payment($type)
    {
        if ($type === 'boleto') {
            return 1.45;
        }

        if ($type === 'cartao_credito') {
            return 7.63;
        }
    }

    /**
     * retorna a taxa de acordo com o tipo de pagamento
     * @param string
     *
     * @return $percentual
     */
    public function percentageFeeWithOneOrTwo($totalBalance)
    {
        if ($totalBalance >= self::VALOR_CONVERSAO) {
            $this->percentual = 1;

            return  $this->percentual;
        }

        if ($totalBalance <= self::VALOR_CONVERSAO) {
            $this->percentual = 2;

            return  $this->percentual;
        }
    }

    public function toConvertBRL($cotacao, Request $request)
    {
        $userid = (int) session()->get('id');
        $totalConversao = (float) $request->valor_conversao;


        $moedaOrigem  = str_replace(",", ".", $request->moeda_origem);
        $moedaDestino = $request->moeda_destino;

        // aborta a execução caso o saldo  seja menor que 1000,00 ou maior 100.000,00
        $this->stopRunning($totalConversao);


        // retorna a cotação da moeda atual
        $cotacaoMoeda = $cotacao->getQuotesCoins($moedaDestino, $moedaOrigem);

        $concat = $moedaDestino . $moedaOrigem;
        $cotacaoMoeda = $cotacaoMoeda[$concat] ?? [];
        $tipo_pagamento = $request->formato_pagamento;

        $moedaOrigem = (float) $cotacaoMoeda['ask'];
        $this->moedaEstrangeira = ($totalConversao / $moedaOrigem);

        $pagamento = $this->payment($tipo_pagamento);
        $percetualCompra = $this->percentageFeeWithOneOrTwo($totalConversao);

        // taxa de pagamento
        $taxaPagamento = ($totalConversao * $pagamento) / 100;

        // taxa de conversão
        $taxaConversao = ($totalConversao *  $percetualCompra) / 100;
        $totalTotal = $totalConversao - $taxaConversao - $taxaPagamento;

        return [
            'user_id' => $userid,
            'taxa_conversao' => $taxaConversao,
            'taxa_pagamento' => $taxaPagamento,
            'moeda_destino' => $moedaOrigem,
            'moedas_comprada' => (int) $this->moedaEstrangeira,
            'total_conversao' =>  $totalTotal,
            'moeda' => $moedaDestino
        ];
    }
}
