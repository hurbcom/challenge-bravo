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

        $data = ['id' => $currency->id];
        $action = $this->app->make(DeleteAction::class);
        $action->run($data);

        $this->notSeeInDatabase('currencies', ['id' => $currency->id]);
    }

    public function testMustBeUuid()
    {
        $data = ['id' => 'non-uuid'];

        $action = $this->app->make(DeleteAction::class);

        try {
            $action->run($data);
            $this->fail('Expected ValidationException');
        } catch (ValidationException $exception) {
            $expected = [
                'id' => [
                    'The id must be a valid UUID.'
                ]
            ];

            $this->assertEquals($expected, $exception->errors());
        }
    }

    public function testInvalidCurrency()
    {
        $data = ['id' => Uuid::uuid4()->toString()];

        $action = $this->app->make(DeleteAction::class);

        try {
            $action->run($data);
            $this->fail('Expected ValidationException');
        } catch (ValidationException $exception) {
            $expected = [
                'id' => [
                    'The selected id is invalid.'
                ]
            ];

            $this->assertEquals($expected, $exception->errors());
        }
    }
}