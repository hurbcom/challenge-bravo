<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Currency;
use App\Services\CurrencyService;
use Tests\TestCase;

class CurrencyTest extends TestCase
{
    protected function setUp() : void
    {
        parent::setUp();
        $this->uri = 'api/v1/currencies';
        $this->currencyService = app(CurrencyService::class);
    }

    public function test_get_all_currencies() : void
    {
        $response = $this->getJson($this->uri);
        $response->assertStatus(200);
    }

    public function test_get_count_currencies() : void
    {
        Currency::factory()->count(10)->create();
        $response = $this->getJson($this->uri);
        $response->assertStatus(200);
        $response->assertJsonCount(10, 'data');
    }

    public function test_get_not_found_currency() : void
    {
        $response = $this->getJson($this->uri . '/171');
        $response->assertStatus(404)
                 ->assertExactJson(['error' => 'Currency Not Found.']);
    }

    public function test_get_currency_with_string_id() : void
    {
        $response = $this->getJson($this->uri . '/foo');
        $response->assertStatus(400)
                 ->assertExactJson(['error' => 'ID must be a number.']);
    }

    public function test_get_found_currency() : void
    {
        $currency = Currency::factory()->create();
        $response = $this->getJson($this->uri . "/{$currency->id}");
        $response->assertStatus(200);
    }

    public function test_create_currency() : void
    {
        $response = $this->postJson($this->uri, [
            'code_currency' => 'hurb',
            'equivalent_value' => 0.25
        ]);
        $response->assertStatus(201);
    }

    public function test_validations_create_currency_with_no_values() : void
    {
        $response = $this->postJson($this->uri, []);
        $response->assertStatus(422);
    }

    public function test_validations_create_unique_currency() : void
    {
        $currency = Currency::factory()->create([
           'code_currency' => 'hurb'
        ]);

        $response = $this->postJson($this->uri, [
            'code_currency' => 'hurb',
            'equivalent_value' => 0.25
        ]);
        $response->assertStatus(422);
    }

    public function test_validations_create_fictitious_currency_with_no_equivalent_value() : void
    {
        $response = $this->postJson($this->uri, ['code_currency' => 'foo']);
        $response->assertStatus(422)
                 ->assertExactJson(['error' => 'For fictitious Currency you should fill equivalent_value field.']);
    }

    public function test_validations_create_currency_with_wrong_equivalent_value() : void
    {
        $response = $this->postJson($this->uri, [
            'code_currency' => 'hurb',
            'equivalent_value' => 'foo'
        ]);
        $response->assertStatus(422);
    }

    public function test_delete_currency() : void
    {
        $currency = Currency::factory()->create();
        $response = $this->deleteJson($this->uri . "/{$currency->id}");
        $response->assertStatus(204);
    }

    public function test_delete_not_found_currency() : void
    {
        $response = $this->deleteJson($this->uri . "/171", []);
        $response->assertStatus(404)
                 ->assertExactJson(['error' => 'Currency Not Found.']);
    }

    public function test_delete_usd_currency() : void
    {
        $currency = $this->currencyService->storeNewCurrency(["code_currency" => "usd"]);

        $response = $this->deleteJson($this->uri . "/{$currency->id}", []);
        $response->assertStatus(403)
                 ->assertExactJson(['error' => 'Not allowed to delete USD currency.']);
    }

    public function test_delete_currency_with_string_id() : void
    {
        $response = $this->deleteJson($this->uri . '/foo');
        $response->assertStatus(400)
            ->assertExactJson(['error' => 'ID must be a number.']);
    }

    public function test_convert_amount() : void
    {
        $currency = $this->currencyService->storeNewCurrency(["code_currency" => "usd"]);
        $currency2 = $this->currencyService->storeNewCurrency(["code_currency" => "brl"]);

        $response = $this->getJson($this->uri . '/convert-amount?from=usd&to=brl&amount=1', []);
        $response->assertStatus(200);
    }

    public function test_convert_amount_with_no_currency_in_database() : void
    {
        $response = $this->getJson($this->uri . '/convert-amount?from=foo&to=brl&amount=1', []);
        $response->assertStatus(404)
                 ->assertExactJson(['error' => 'Currency Not Found.']);
    }
}
