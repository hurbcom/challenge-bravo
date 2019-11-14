<?php

namespace tests\Unit\Core\Actions\Currency;

use App\Core\Actions\Currency\DeleteAction;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use App\Models\Currency;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Testing\DatabaseTransactions;
use Ramsey\Uuid\Uuid;
use TestCase;

class DeleteActionTest extends TestCase
{
    use DatabaseTransactions;

    public function testDeleteSuccess()
    {
        $currency = factory(Currency::class)
            ->create([
                'code' => 'USD',
                'source' => ExchangeRatesManager::TYPE
            ]);

        $data = ['code' => $currency->code];
        $action = $this->app->make(DeleteAction::class);
        $action->run($data);

        $this->notSeeInDatabase('currencies', ['code' => $currency->code]);
    }

    public function testInvalidCurrency()
    {
        $data = ['code' => 'INVALID'];

        $action = $this->app->make(DeleteAction::class);

        try {
            $action->run($data);
            $this->fail('Expected ValidationException');
        } catch (ValidationException $exception) {
            $expected = [
                'code' => [
                    'The selected code is invalid.'
                ]
            ];

            $this->assertEquals($expected, $exception->errors());
        }
    }
}