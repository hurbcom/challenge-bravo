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

        /**
         * @var $action ConvertAction
         */
        $action = $this->app->make(ConvertAction::class);

        $data = [
            'from' => 'BRL',
            'to' => 'EUR',
            'amount' => 10
        ];

        $result = $action->run($data);

        $expected = [
            'converted_amount' => 2.19
        ];

        $this->assertEquals($expected, $result);
    }
}