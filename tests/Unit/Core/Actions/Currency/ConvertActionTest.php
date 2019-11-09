<?php

use App\Core\Actions\Currency\ConvertAction;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use App\Models\Currency;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ConvertActionTest extends TestCase
{
    use DatabaseTransactions;

    public function testConvertSuccess(): void
    {
        // Preparing scenario
        factory(Currency::class)->create([
            'code' => 'BRL',
            'source' => ExchangeRatesManager::TYPE
        ]);

        factory(Currency::class)->create([
            'code' => 'EUR',
            'source' => ExchangeRatesManager::TYPE
        ]);

        $this->mockDefaultHttpClientResponses(
            'exchange_rates/find_rates_success.yml'
        );

        /**
         * @var $action ConvertAction
         */
        $action = $this->app->make(ConvertAction::class);

        $data = [
            'from' => 'BRL',
            'amount' => 10,
            'to' => 'EUR',
        ];

        $result = $action->run($data);

        $expected = [
            'converted_amount' => 2.19
        ];

        $this->assertEquals($expected, $result);
    }

    public function testFromBaseConvertSuccess(): void
    {
        // Preparing scenario
        factory(Currency::class)->create([
            'code' => 'BRL',
            'source' => ExchangeRatesManager::TYPE
        ]);

        factory(Currency::class)->create([
            'code' => 'USD',
            'source' => ExchangeRatesManager::TYPE
        ]);

        $this->mockDefaultHttpClientResponses(
            'exchange_rates/find_rates_success.yml'
        );

        /**
         * @var $action ConvertAction
         */
        $action = $this->app->make(ConvertAction::class);

        $data = [
            'from' => 'USD',
            'amount' => 10,
            'to' => 'BRL',
        ];

        $result = $action->run($data);

        $expected = [
            'converted_amount' => 41.31
        ];

        $this->assertEquals($expected, $result);

        $data = [
            'from' => 'BRL',
            'amount' => 41.31,
            'to' => 'USD',
        ];

        $result = $action->run($data);

        $expected = [
            'converted_amount' => 10
        ];

        $this->assertEquals($expected, $result);
    }

    public function testToBaseConvertSuccess(): void
    {
        // Preparing scenario
        factory(Currency::class)->create([
            'code' => 'BRL',
            'source' => ExchangeRatesManager::TYPE
        ]);

        factory(Currency::class)->create([
            'code' => 'USD',
            'source' => ExchangeRatesManager::TYPE
        ]);

        $this->mockDefaultHttpClientResponses(
            'exchange_rates/find_rates_success.yml'
        );

        /**
         * @var $action ConvertAction
         */
        $action = $this->app->make(ConvertAction::class);

        $data = [
            'from' => 'BRL',
            'amount' => 41.31,
            'to' => 'USD'
        ];

        $result = $action->run($data);

        $expected = [
            'converted_amount' => 10
        ];

        $this->assertEquals($expected, $result);
    }
}