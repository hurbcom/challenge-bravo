<?php

use PHPUnit\Framework\TestCase;

class ApiTest extends TestCase
{

	const URL = 'http://localhost/challenge-bravo/api';

	public static function createRequest($url, $method, $data = NULL, $header = NULL)
	{

		$header[] = 'Content-Type: application/json; charset=utf-8';
		$method = strtoupper($method);
		$url =  self::URL . $url;

		$curl = curl_init($url);

		curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLINFO_HEADER_OUT, true);
		curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 30);
		curl_setopt($curl, CURLOPT_TIMEOUT, 30);

		if ($method != 'GET') {
			curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
			if ($data) {
				$json = json_encode($data);
				curl_setopt($curl, CURLOPT_POSTFIELDS, $json);
			}
		} else if ($data) {
			curl_setopt($curl, CURLOPT_URL, $url . '?' . http_build_query($data));
		}

		$curl_exec = curl_exec($curl);
		$curl_info = curl_getinfo($curl);
		$curl_error = curl_error($curl);

		curl_close($curl);

		if ($curl_error) {
			throw new Exception('Curl error: ' . $curl_error);
		}

		return ['response' => $curl_exec, 'info' => $curl_info];
	}

	public function testConvertSuccess(): void
	{
		$request = $this->createRequest('/', 'GET', ['from' => 'USD', 'to' => 'USD', 'amount' => '10']);
		self::assertJsonStringEqualsJsonString($request['response'], '{"from": "USD", "to": "USD", "amount": "10", "result": 10}');
		self::assertEquals($request['info']['http_code'], 200);
	}

	public function testConvertParamError(): void
	{
		$request = $this->createRequest('/', 'GET');
		self::assertJsonStringEqualsJsonString($request['response'], '{"message": "Formato inválido. Ex.: ?from=BTC&to=EUR&amount=123.45"}');
		self::assertEquals($request['info']['http_code'], 400);
	}

	public function testAddCurrencyCreated(): void
	{
		$request = $this->createRequest('/', 'POST', ['name' => 'TESTE', 'amount' => 123]);
		self::assertJsonStringEqualsJsonString($request['response'], '{"message": "Moeda cadastrada com sucesso."}');
		self::assertEquals($request['info']['http_code'], 200);
	}

	public function testAddCurrencyErrorDuplicateCurrencyName(): void
	{
		$request = $this->createRequest('/', 'POST', ['name' => 'TESTE', 'amount' => 123]);
		self::assertJsonStringEqualsJsonString($request['response'], '{"message": "TESTE já existe."}');
		self::assertEquals($request['info']['http_code'], 400);
	}

	public function testAddCurrencyParamError(): void
	{
		$request = $this->createRequest('/', 'POST');
		self::assertJsonStringEqualsJsonString($request['response'], '{"message": "Formato inválido. Ex.: {\"name\": \"BTC\", \"amount\": 39006.37}"}');
		self::assertEquals($request['info']['http_code'], 400);
	}

	public function testRemoveCurrencySuccess(): void
	{
		$request = $this->createRequest('/', 'DELETE', ['name' => 'TESTE']);
		self::assertJsonStringEqualsJsonString($request['response'], '{"message": "Moeda excluída com sucesso."}');
		self::assertEquals($request['info']['http_code'], 200);
	}

	public function testRemoveCurrencyErrorCurrencyNameNotFound(): void
	{
		$request = $this->createRequest('/', 'DELETE', ['name' => 'TESTE']);
		self::assertJsonStringEqualsJsonString($request['response'], '{"message": "Moeda TESTE não encontrada."}');
		self::assertEquals($request['info']['http_code'], 400);
	}
}
