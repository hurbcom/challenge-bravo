<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\HttpClient\CurlHttpClient;
use App\Services\CurrencyService;
use Tests\TestCase;

class CurrencyServiceTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->currencyService = app(CurrencyService::class);
    }

    public function test_convert_amount_between_two_true_currencies() : void
    {
        $params = [
            'from'   => 'usd',
            'to'     => 'brl',
            'amount' => 1
        ];

        /**
         * Convert USD to BRL
         * Quotation from USD to BRL
         * 1 USD is ? BRL
         */
        $url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/brl.json';
        $quotation = (new CurlHttpClient())->startHttpClient($url, 'GET');
        $quotation = $quotation[$params['to']];

        $currency = $this->currencyService->storeNewCurrency(["code_currency" => "usd"]);
        $currency2 = $this->currencyService->storeNewCurrency(["code_currency" => "brl"]);

        $result = $this->currencyService->convertAmount($params);

        $expected = $quotation * $params['amount'];
        $expected = $this->getFormatedQuotation($expected);

        $this->assertEquals($expected, $result);
    }

    public function test_convert_amount_with_currency_not_in_database() : void
    {
        $params = [
            'from'   => 'usd',
            'to'     => 'brl',
            'amount' => 1
        ];

        $result = $this->currencyService->convertAmount($params);

        $this->assertEquals('', $result);
    }

    public function test_convert_amount_between_one_ficticial_and_one_true_currencies() : void
    {
        $currency = $this->currencyService->storeNewCurrency([
            "code_currency" => "psn",
            "equivalent_value" => 3.724512
        ]);
        $currency2 = $this->currencyService->storeNewCurrency([
            "code_currency" => "brl"
        ]);
        $currency3 = $this->currencyService->storeNewCurrency([
            "code_currency" => "usd"
        ]);
        $params = [
            'from'   => 'psn',
            'to'     => 'brl',
            'amount' => 1
        ];

        /**
         * Convert PSN to USD then to BRL
         * Quotation from USD to BRL
         * 1 USD is ? BRL
         */
        $url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/brl.json';
        $quotation = (new CurlHttpClient())->startHttpClient($url, 'GET');
        $quotation = $quotation[$params['to']];

        $result = $this->currencyService->convertAmount($params);

        /**
         * How to convert amount
         * amount * equivalent_value * usd_quotation
         */
        $expected = $params['amount'] * $currency['equivalent_value'] * $quotation;
        $expected = $this->getFormatedQuotation($expected);

        $this->assertEquals($expected, $result);
    }

    public function test_convert_amount_between_one_true_and_one_ficticial_currencies() : void
    {
        $currency1 = $this->currencyService->storeNewCurrency([
            "code_currency" => "brl"
        ]);
        $currency2 = $this->currencyService->storeNewCurrency([
            "code_currency" => "psn",
            "equivalent_value" => 3.724512
        ]);
        $currency3 = $this->currencyService->storeNewCurrency([
            "code_currency" => "usd"
        ]);

        $params = [
            'from'   => 'brl',
            'to'     => 'psn',
            'amount' => 1
        ];

        /**
         * Convert BRL to USD then to PSN
         * Quotation from BRL to USD
         * 1 BRL is ? USD
         */
        $url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/brl/usd.json';
        $quotation = (new CurlHttpClient())->startHttpClient($url, 'GET');
        $quotation = $quotation['usd'];

        $result = $this->currencyService->convertAmount($params);

        /**
         * How to convert amount
         * amount * usd_quotation * equivalent_value
         */
        $expected = $params['amount'] * (float)$quotation * $currency2['equivalent_value'];
        $expected = $this->getFormatedQuotation($expected);

        $this->assertEquals($expected, $result);
    }

    /**
     * All Ficticial currencies have USD as baseCurrency(lastro)
     */
    public function test_convert_amount_between_two_ficticial_currencies() : void
    {
        $currency = $this->currencyService->storeNewCurrency([
            "code_currency" => "psn",
            "equivalent_value" => 50
        ]);
        $currency2 = $this->currencyService->storeNewCurrency([
            "code_currency" => "xbx",
            "equivalent_value" => 100
        ]);
        $params = [
            'from'   => 'psn',
            'to'     => 'xbx',
            'amount' => 1
        ];

        $result = $this->currencyService->convertAmount($params);

        /**
         * How to convert amount
         * All Ficticial currencies have the same base_currency(lastro) - USD
         * to_equivalent_value / from_equivalent_value
         */
        $expected = $currency['equivalent_value'] / $currency2['equivalent_value'];
        $expected = $this->getFormatedQuotation($expected);

        $this->assertEquals($expected, $result);
    }

    protected function getFormatedQuotation(float $quotation) : string
    {
        return number_format($quotation, 4, ',', '.');
    }
}
