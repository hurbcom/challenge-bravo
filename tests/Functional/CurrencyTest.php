<?php

namespace tests\Functional;

use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use App\Models\Currency;
use Laravel\Lumen\Testing\DatabaseTransactions;
use TestCase;

class CurrencyTest extends TestCase
{
    use DatabaseTransactions;

    public function testCreateCurrency()
    {
        $uri = route('currency_create');

        $data = [
            'code' => 'USD'
        ];

        $this->assertCount(0, Currency::all());

        $response = $this->post($uri, $data);

        $response->assertResponseOk();

        $this->seeInDatabase('currencies', $data);
    }

    public function testCreateCurrencyInvalid()
    {
        $uri = route('currency_create');

        // empty object
        $data = [];

        $this->assertCount(0, Currency::all());

        $response = $this->json('POST', $uri, $data);

        $this->assertCount(0, Currency::all());

        $response->assertResponseStatus(422);

        $response->seeJsonStructure([
            'errors' => [
                'code'
            ]
        ]);
    }

    public function testDeleteCurrency()
    {
        $currency = factory(Currency::class)->create([
            'code' => 'USD',
            'source' => 'test'
        ]);

        $uri = route('currency_delete', [
            'id' => $currency->id
        ]);

        $this->assertCount(1, Currency::all());

        $response = $this->delete($uri);

        $response->assertResponseOk();

        $this->assertCount(0, Currency::all());
    }

    public function testDeleteCurrencyInvalid()
    {
        factory(Currency::class)->create([
            'code' => 'USD',
            'source' => 'test'
        ]);

        $uri = route('currency_delete', [
            'id' => 'invalid'
        ]);

        $this->assertCount(1, Currency::all());

        $response = $this->delete($uri);

        $response->assertResponseStatus(422);

        $response->seeJsonStructure([
            'errors' => [
                'id'
            ]
        ]);

        $this->assertCount(1, Currency::all());
    }
}