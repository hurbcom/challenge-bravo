<?php
class ConversorTest extends PHPUnit_Framework_TestCase{
	
	public function testType($value){
		// faz um assert no tipo de valor retornado
		$this->assertInternalType('float', $value);
	}
	
	public function testConverter(){
		// seta os valores para teste
		$from = "BTC";
		$to = "EUR";
		$value = 123.45;
		
		// instancia a classe de conversor
		$conv = new Conversor();
		// seta o valor
		$conv->setValue($value);
		// faz a conversão
		$valueInReal = $conv->converter2Real($from);
		$finalValue = $conv->converterReal2To($to, $valueInReal);
		// chama o assert de tipo
		testType($finalValue);
		// faz um assert no valor final retornado
		$this->assertEquals("EUR 1.228.926,08", $conv->addMoneySymbol($finalValue, $to));
	}
}