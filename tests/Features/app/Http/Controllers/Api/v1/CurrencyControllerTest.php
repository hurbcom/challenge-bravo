<?php

use App\Models\Currency;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CurrencyControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * User Can Create Currencies.
     *
     * @return void
     */
    public function testUserCanCreateCurrencies(): void
    {
        $payload = Currency::factory()->definition();

        $result = $this->post('api/v1/currencies', $payload);
        $result->assertResponseStatus(201);
        $result->seeInDatabase('currency', $payload);
    }

    /**
     * User Cannot Duplicate Currencies.
     *
     * @return void
     */
    public function testUserCannotDuplicateCurrencies(): void
    {
        $result = $this->post('api/v1/currencies', ['code'=>'USD', 'price'=>'100']);
        $result->assertResponseStatus(422);
    }

    /**
     * User should send a code and price to persist.
     *
     * @return void
     */
    public function testUserShouldSendCodeAndPriceToPersist(): void
    {
        $result = $this->post('api/v1/currencies', []);
        $result->assertResponseStatus(422);
    }

    /**
     * User can read all currencies.
     *
     * @return void
     */
    public function testUserCanReadAllCurrencies(): void
    {
        Currency::factory()->create();
        Currency::factory()->create();
        Currency::factory()->create();
        Currency::factory()->create();

        $result = $this->get('api/v1/currencies/');
        $result->assertResponseOk();
    }

    /**
     * User can read a currency by id.
     *
     * @return void
     */
    public function testUserCanReadCurrencyById(): void
    {
        $currency = Currency::factory()->create();

        $result = $this->get('api/v1/currency/' . $currency->id);
        $result->assertResponseOk();
        $result->seeJsonContains([
            'code' => $currency->code,
        ]);
    }

    /**
     * User Should Receive 404 When Currency Not Exists.
     *
     * @return void
     */
    public function testUserShouldReceive404WhenCurrencyNotExists(): void
    {
        $result = $this->get('/api/v1/currency/99999');
        $result->assertResponseStatus(404);
        $result->seeJsonStructure(['error']);
    }

    /**
     * User Can Update The Price Currency.
     *
     * @return void
     */
    public function testUserCanUpdatePrice(): void
    {
        $currency = Currency::factory()->create();
        $price = 321.11;

        $result = $this->patch('/api/v1/currency/' . $currency->id, [
            'price' => $price
        ]);

        $result->assertResponseStatus(200);
        $result->seeInDatabase('currency', [
            'id' => $currency->id,
            'price' => $price,
        ]);
    }

    /**
     * User Should Receive 404 When Update Currency Not Exists.
     *
     * @return void
     */
    public function testUserShouldReceive404WhenUpdateCurrencyNotExists(): void
    {
        $currencyId = 99999;
        $price = 321.11;

        $result = $this->patch('/api/v1/currency/' . $currencyId, [
            'price' => $price
        ]);

        $result->assertResponseStatus(404);
        $result->seeJsonStructure(['error']);
    }

    /**
     * User Can Delete Currency.
     *
     * @return void
     */
    public function testUserCanDelete(): void
    {
        $currency = Currency::factory()->create();

        $result = $this->delete('/api/v1/currency/' . $currency->id);
        $result->assertResponseStatus(204);
        $result->notSeeInDatabase('currency', [
            'id' => $currency->id
        ]);
    }

    /**
     * User Should Receive 404 When Delete Currency Not Exists.
     *
     * @return void
     */
    public function testUserShouldReceive404WhenDeleteCurrencyNotExists(): void
    {
        $currencyId = 99999;
        $result = $this->delete('/api/v1/currency/' . $currencyId);
        $result->assertResponseStatus(404);
        $result->seeJsonStructure(['error']);
    }

    /**
     * User Can Converts Currency.
     *
     * @return void
     */
    public function testUserCanConvertsCurrency(): void
    {
        $result = $this->get("api/v1/convert-currency/?to=BTC&from=EUR&amount=123.45");
        $result->assertResponseOk();
        $result->seeJsonStructure(['convertedAmount']);
    }
}
