<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\CurrencyConverter;

class CurrencyConverterControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * @return void
     */
    public function testIndex()
    {
        $params = [ 'from' => 'EUR', 'to' => 'BRL', 'amount' => 13.13];

        $this->get(route('index', $params))
            ->assertStatus(200)
            ->assertJson($params);
    }

    /**
     * @return void
     */
    public function testCachedIndex()
    {
        $params = [ 'from' => 'EUR', 'to' => 'BRL', 'amount' => 13.13];

        $this->get(route('index', $params))
            ->assertStatus(200)
            ->assertJson($params);
        
        $this->get(route('index', $params))
            ->assertStatus(200)
            ->assertJson($params);
    }

    /**
     * @return void
     */
    public function testIndexWithiutFromCurrency()
    {
        $params = [ 'from' => '', 'to' => 'BRL', 'amount' => 13.13];
        $expectedResult = ['Origin currency not informed'];

        $this->get(route('index', $params))
            ->assertStatus(200)
            ->assertJson($expectedResult);
    }

    /**
     * @return void
     */
    public function testAvaliableCurrencies()
    {
        $this->get(route('avaliableCurrencies'))
            ->assertStatus(200)
            ->assertJson($params);
    }

    /**
     * @return void
     */
    public function testDestroy()
    {
        $params = [ 'currency' => 'USD'];
        $expectedResult = ['deletedCurrency' => 'USD'];

        $this->delete(route('destroy', $params))
            ->assertStatus(200)
            ->assertJson($expectedResult);
    }

    /**
     * @return void
     */
    public function testDestroyWithoutCurrency()
    {
        $params = [ 'currency' => ''];
        $expectedResult = ['Currency not informed'];

        $this->delete(route('destroy', $params))
            ->assertStatus(200)
            ->assertJson($expectedResult);
    }

    /**
     * @return void
     */
    public function testInsertCurrencyWithoutAutomaticUpdate()
    {
        $params = [ 'currency' => 'YYY', 'value' => 13.13];

        $this->post(route('create', $params))
            ->assertStatus(200)
            ->assertJson($params);
    }

    /**
     * @return void
     */
    public function testInsertCurrencyWithoutCurrency()
    {
        $params = [ 'currency' => '', 'value' => 13.13];
        $expectedResult = ['Currency not informed'];

        $this->post(route('create', $params))
            ->assertStatus(200)
            ->assertJson($expectedResult);
    }

    /**
     * @return void
     */
    public function testUpdateCurrencyWithoutAutomaticUpdate()
    {
        $params = [ 'currency' => 'YYY', 'value' => 13.13];
        $this->post(route('create', $params))
            ->assertStatus(200)
            ->assertJson($params);;

        $newParams = [ 'currency' => 'YYY', 'value' => 26.26];

        $this->put(route('update', $newParams))
            ->assertStatus(200)
            ->assertJson($newParams);;
    }

    /**
     * @return void
     */
    public function testUpdateCurrencyWithoutCurrency()
    {
        $params = [ 'currency' => '', 'value' => 13.13];
        $expectedResult = ['Currency not informed'];

        $this->put(route('update', $params))
            ->assertStatus(200)
            ->assertJson($expectedResult);
    }
}
