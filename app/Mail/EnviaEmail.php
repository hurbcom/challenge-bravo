<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EnviaEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $nome;

    public $moeda;

    public $dataCotacao;

    public $taxaPagamento;

    public $taxaConversao;

    public $moedaDestino;

    public $moedaComprada;

    public $totalConversao;


    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(array $cotacao)
    {
        $this->nome = session()->get('name');

        $this->moeda = $cotacao['moeda'];
        $this->taxaConversao = $cotacao['taxa_conversao'];
        $this->taxaPagamento = $cotacao['taxa_pagamento'];
        $this->moedaDestino = $cotacao['moeda_destino'];
        $this->moedaComprada = $cotacao['moedas_comprada'];
        $this->totalConversao = $cotacao['total_conversao'];
        $this->dataCotacao = date('d/m/Y');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.notifica-usuario')->subject('Nova cotação');
    }
}
