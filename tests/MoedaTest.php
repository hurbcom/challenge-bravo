<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class MoedaTest extends TestCase
{
    use DatabaseTransactions;

    protected string $endpoint = '/api/currency/';

    public function testRetornandoListagemDeMoedas(): void
    {
        $this->json('GET', $this->endpoint)
            ->seeJson([
                'success' => true,
            ]);
    }

    public function testSalvandoMoeda(): void
    {
        $this->json('POST', $this->endpoint, ['nome' => 'OURO'])
            ->seeJson([
                'success' => true,
            ]);
    }

    public function testAtualizandoMoeda(): void
    {
        $this->json('PATCH', $this->endpoint.'USD', ['nome' => 'OURO'])
            ->seeJson([
                'success' => true,
            ]);
    }

    public function testRemovendoMoeda(): void
    {
        $this->json('DELETE', $this->endpoint.'USD')
            ->seeJson([
                'success' => true,
            ]);
    }

    public function testFazendoConversaoDeMoedas(): void
    {
        $this->json('GET', $this->endpoint.'conversion', ['to' => 'USD','from' => 'BRL','amount' => 1,])
            ->seeJson([
                'success' => true,
            ]);
    }

    public function testFazendoConversaoDeMoedasComParametrosErrados(): void
    {
        $this->json('GET', $this->endpoint.'conversion', ['amount' => 1,])
            ->seeJson([
                'success' => false,
            ]);
    }
}
