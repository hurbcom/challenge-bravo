<?php

namespace tests\Unit\Core\Actions\Currency;

use App\Core\Actions\Currency\CreateAction;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use App\Models\Currency;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Testing\DatabaseTransactions;
use TestCase;

class CreateActionTest extends TestCase
{
    use DatabaseTransactions;

    public function testCreateSuccess()
    {
        $data = [
            'code' => 'USD'
        ];

        $this->assertCount(0, Currency::all());

        /**
         * @var $action CreateAction
         */
        $action = $this->app->make(CreateAction::class);

        $result = $action->run($data);

        $this->assertEquals([], $result);

        $this->seeInDatabase('currencies', $data);
    }

    public function testRequiredFieldsSuccess()
    {
        $data = [
            'code' => null
        ];

        $this->assertCount(0, Currency::all());

        /**
         * @var $action CreateAction
         */
        $action = $this->app->make(CreateAction::class);

        try {
            $action->run($data);
            $this->fail('Expected ValidationException');
        } catch (ValidationException $exception) {
            $expected = [
                'code' => [
                    'The code field is required.'
                ]
            ];

            $this->assertEquals($expected, $exception->errors());
            $this->assertCount(0, Currency::all());
        }
    }

    public function testUniqueCodeSuccess()
    {
        $data = [
            'code' => 'USD'
        ];

        factory(Currency::class)->create([
            'code' => 'USD',
            'source' => ExchangeRatesManager::TYPE
        ]);

        /**
         * @var $action CreateAction
         */
        $action = $this->app->make(CreateAction::class);

        try {
            $action->run($data);
            $this->fail('Expected ValidationException');
        } catch (ValidationException $exception) {
            $expected = [
                'code' => [
                    'The code has already been taken.'
                ]
            ];

            $this->assertEquals($expected, $exception->errors());
            $this->assertCount(1, Currency::all());
        }
    }

    public function testUnsupportedCodeSuccess()
    {
        $data = [
            'code' => 'UNSUPPORTED'
        ];

        /**
         * @var $action CreateAction
         */
        $action = $this->app->make(CreateAction::class);

        try {
            $action->run($data);
            $this->fail('Expected ValidationException');
        } catch (ValidationException $exception) {
            $expected = [
                'code' => [
                    'Currency not supported.'
                ]
            ];

            $this->assertEquals($expected, $exception->errors());
            $this->assertCount(0, Currency::all());
        }
    }
}
