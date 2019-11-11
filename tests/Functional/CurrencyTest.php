<?php

namespace tests\Functional;

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
}