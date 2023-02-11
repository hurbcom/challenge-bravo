<?php

namespace Tests\Feature;

use App\Models\Coin;
use App\Services\CurrencyConversionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CurrencyConversionServiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Testa a conversão de moedas usando moeda real não cadastrada.
     *
     * @return void
     */
    public function testConversionWithUnavailableRealCurrency()
    {
        // Define os parâmetros de entrada
        $amount = 10;
        $from = 'XYZ'; // moeda inexistente
        $to = 'USD';

        // Instancia o serviço a ser testado
        $service = new CurrencyConversionService();

        // Executa o método a ser testado e recebe o resultado
        $result = $service->convert($amount, $from, $to);

        // Verifica se o resultado contém a mensagem de erro esperada
        $this->assertEquals(['error' => "Coin $from doesn't avaliable"], $result);
    }
    
    /**
     * Testa a conversão de moedas usando moeda cadastrada no banco de dados.
     *
     * @return void
     */
    public function testConversionWithPersonalCurrency()
    {
        // Cria uma moeda para ser usada no teste
        $coin = Coin::create(['name' => 'Foo', 'code' => 'ABC', 'dolarValue' => 1]);

        // Define os parâmetros de entrada
        $amount = 10;
        $from = 'ABC'; // moeda personalizada
        $to = 'USD';
        // Instancia o serviço a ser testado
        $service = new CurrencyConversionService();
        
        // Executa o método a ser testado e recebe o resultado
        $result = $service->convert($amount, $from, $to);
        
        // Verifica se o resultado contém o valor esperado
        
        $this->assertEquals(['result' => 10 ], $result); 
    }
}
