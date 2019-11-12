<?php

namespace tests\Functional\Source;

use App\Core\Currency\Source\CoinApi\CoinApiManager;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use App\Models\Currency;
use Laravel\Lumen\Testing\DatabaseTransactions;
use TestCase;

class ConvertWithCoinApiTest extends TestCase
{
    use DatabaseTransactions;

    public function testConvertCurrency()
    {
        factory(Currency::class)->create([
            'code' => 'BRL',
            'source' => ExchangeRatesManager::TYPE
        ]);

        factory(Currency::class)->create([
            'code' => 'BTC',
            'source' => CoinApiManager::TYPE
        ]);

        $uri = route('currency_convert', [
            'from' => 'BRL',
            'to' => 'BTC',
            'amount' => 10.0
        ]);

        $this->mockDefaultHttpClientResponses(
            'exchange_rates/find_rates_success.yml',
            'coin_api/exchange_rates_success.yml'
        );

        $response = $this->get($uri);

        $response->assertResponseOk();

        $response->seeJsonStructure([
            'converted_amount'
        ]);
    }

    public function testConvertCurrencyInvalid()
    {
        $uri = route('currency_convert', [
            'from' => 'invalid',
            'to' => 'invalid',
            'amount' => 'invalid'
        ]);

        $response = $this->get($uri);

        $response->assertResponseStatus(422);

        $response->seeJsonStructure([
            'errors' => [
                'from',
                'to',
                'amount'
            ]
        ]);
    }

    public function testExternalIntegrationError()
    {
        factory(Currency::class)->create([
            'code' => 'ETH',
            'source' => CoinApiManager::TYPE
        ]);

        factory(Currency::class)->create([
            'code' => 'BRL',
            'source' => ExchangeRatesManager::TYPE
        ]);

        $uri = route('currency_convert', [
            'from' => 'BRL',
            'to' => 'ETH',
            'amount' => 2.0
        ]);

        $this->mockDefaultHttpClientResponses(
            'exchange_rates/find_rates_success.yml',
            'coin_api/internal_server_error.yml'
        );

        $response = $this->get($uri);

        $response->assertResponseStatus(500);

        $response->seeJsonStructure([
            'error_message'
        ]);
    }
}