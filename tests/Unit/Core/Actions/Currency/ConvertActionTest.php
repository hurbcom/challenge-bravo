<?php

use App\Core\Actions\Currency\ConvertAction;
use App\Core\Currency\Source\ExchangeRates\ExchangeRatesManager;
use App\Core\HttpClient\HttpClientException;
use App\Models\Currency;
use Illuminate\Validation\ValidationException;
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
            'converted_amount' => 2.1938
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
            'converted_amount' => 41.3114
        ];

        $this->assertEquals($expected, $result);

        $data = [
            'from' => 'BRL',
            'amount' => 41.3114,
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
            'converted_amount' => 9.99966
        ];

        $this->assertEquals($expected, $result);
    }

    public function testUnsupportedCurrency(): void
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
            'from' => 'UNSUPPORTED',
            'amount' => 10,
            'to' => 'UNSUPPORTED',
        ];

        try {
            $action->run($data);
            $this->fail('Expected the ValidationException has to be throw');
        } catch (ValidationException $exception) {
            $expected = [
                'from' => ['Currency not supported.'],
                'to' => ['Currency not supported.']
            ];
            $this->assertEquals($expected, $exception->errors());
        }
    }

    public function testAmountNonNumericCurrency(): void
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
            'amount' => 'test',
            'to' => 'EUR',
        ];

        try {
            $action->run($data);
            $this->fail('Expected the ValidationException has to be throw');
        } catch (ValidationException $exception) {
            $expected = [
                'amount' => [
                    'The amount must be a number.',
                    'Amount must be greater than zero.'
                ]
            ];
            $this->assertEquals($expected, $exception->errors());
        }
    }

    public function testAmountLessThanZeroCurrency(): void
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
            'amount' => -1,
            'to' => 'EUR',
        ];

        try {
            $action->run($data);
            $this->fail('Expected the ValidationException has to be throw');
        } catch (ValidationException $exception) {
            $expected = [
                'amount' => [
                    'Amount must be greater than zero.'
                ]
            ];
            $this->assertEquals($expected, $exception->errors());
        }
    }

    public function testRequiredFieldsCurrency(): void
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
            'from' => null,
            'amount' => null,
            'to' => null
        ];

        try {
            $action->run($data);
            $this->fail('Expected the ValidationException has to be throw');
        } catch (ValidationException $exception) {
            $expected = [
                'from' => ['The from field is required.'],
                'amount' => ['The amount field is required.'],
                'to' => ['The to field is required.']
            ];
            $this->assertEquals($expected, $exception->errors());
        }
    }

    public function testHttpClientErrorExchangeRates(): void
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
            "exchange_rates/internal_server_error.yml"
        );

        /**
         * @var $action ConvertAction
         */
        $action = $this->app->make(ConvertAction::class);

        $data = [
            'from' => 'BRL',
            'amount' => 100,
            'to' => 'EUR'
        ];

        try {
            $action->run($data);
            $this->fail('Expected the ValidationException has to be throw');
        } catch (HttpClientException $exception) {

            $message = "Error on client App\Core\Currency\Source\ExchangeRates\HttpClient when trying to request App\Core\Currency\Source\ExchangeRates\FindRates (GET /latest?base=USD)";

            $this->assertEquals($message, $exception->getMessage());
        }
    }
}