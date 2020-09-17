<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\CurrencyConverter;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Artisan;

class CurrencyConverterTest extends TestCase
{
    use DatabaseTransactions;

    public function clearCache()
    {
        Artisan::call('cache:clear');
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testGetConvertedValueWithNonSuportedCurrency()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $from = 'YYY';
        $to = 'BRL';
        $amount = 13.13;

        $convertedValueJson = $model->getConvertedValue($from, $to, $amount);
        $convertedValue = json_decode($convertedValueJson);
        $this->assertEquals($from, $convertedValue->from);
        $this->assertEquals($to, $convertedValue->to);
        $this->assertEquals($amount, $convertedValue->amount);
        $this->assertEquals(CurrencyConverter::ERROR_UNSUPORTED_CURRENCY, $convertedValue->errorMsg);
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testGetConvertedValueWithDollar()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $from = 'EUR';
        $to = 'USD';
        $amount = 13.13;

        $convertedValueJson = $model->getConvertedValue($from, $to, $amount);
        $convertedValue = json_decode($convertedValueJson);
        $this->assertEquals($from, $convertedValue->from);
        $this->assertEquals($to, $convertedValue->to);
        $this->assertEquals($amount, $convertedValue->amount);
        $this->assertTrue(empty($convertedValue->errors));
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testGetConvertedValue()
    {
        $model = new CurrencyConverter();

        $from = 'EUR';
        $to = 'BRL';
        $amount = 13.13;

        $convertedValueJson = $model->getConvertedValue($from, $to, $amount);
        $convertedValue = json_decode($convertedValueJson);
        $this->assertEquals($from, $convertedValue->from);
        $this->assertEquals($to, $convertedValue->to);
        $this->assertEquals($amount, $convertedValue->amount);
        $this->assertTrue(empty($convertedValue->errors));
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testInsertNewCurrencyWithOutAutomaticUpdate()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $currency = 'YYY';
        $value = 13.13;

        $newConversionJson = $model->insertCurrency($currency, $value);
        $newConversion = json_decode($newConversionJson);
        $this->assertEquals($currency, $newConversion->currency);
        $this->assertEquals($value, $newConversion->value);
        $this->assertFalse($newConversion->hasAutomaticUpdate);
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testGetConvertedValueOnCurrencyWithOutAutomaticUpdate()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $currency = 'YYY';
        $value = 13.13;

        $newConversionJson = $model->insertCurrency($currency, $value);
        $newConversion = json_decode($newConversionJson);
        $this->assertEquals($currency, $newConversion->currency);
        $this->assertEquals($value, $newConversion->value);
        $this->assertFalse($newConversion->hasAutomaticUpdate);

        $from = 'EUR';
        $to = 'YYY';
        $amount = 26.26;

        $this->clearCache();

        $expectedError = [0 => 'YYY'];

        $convertedValueJson = $model->getConvertedValue($from, $to, $amount);
        $convertedValue = json_decode($convertedValueJson);
        $this->assertEquals($from, $convertedValue->from);
        $this->assertEquals($to, $convertedValue->to);
        $this->assertEquals($amount, $convertedValue->amount);
        $this->assertEquals($expectedError, $convertedValue->errors);
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testInsertNewCurrencyWithAutomaticUpdate()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $currency = 'JPY';
        $value = 13.13;

        $newConversionJson = $model->insertCurrency($currency, $value);
        $newConversion = json_decode($newConversionJson);
        $this->assertEquals($currency, $newConversion->currency);
        $this->assertTrue($newConversion->hasAutomaticUpdate);
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testTryInsertDuplicateCurrency()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $currency = 'USD';
        $value = 13.13;

        $newConversionJson = $model->insertCurrency($currency, $value);
        $newConversion = json_decode($newConversionJson);
        $this->assertEquals($currency, $newConversion->currency);
        $this->assertEquals($value, $newConversion->value);
        $this->assertEquals(CurrencyConverter::ERROR_DUPLICATE_CURRENCY, $newConversion->error);
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testDeleteCurrencyNotFoundError()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $currency = 'YYY';

        $deletedCurrencyJson = $model->deleteCurrency($currency);
        $deletedCurrency = json_decode($deletedCurrencyJson);
        $this->assertEquals($currency, $deletedCurrency->currency);
        $this->assertEquals(CurrencyConverter::ERROR_CURRENCY_NOT_FOUND, $deletedCurrency->error);
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testDeleteCurrency()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $currency = 'USD';

        $deletedCurrencyJson = $model->deleteCurrency($currency);
        $deletedCurrency = json_decode($deletedCurrencyJson);
        $this->assertEquals($currency, $deletedCurrency->deletedCurrency);
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testUpdateCurrencyNotFoundError()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $currency = 'YYY';
        $value = 13.13;

        $updatedCurrencyJson = $model->updateCurrency($currency, $value);
        $updatedCurrency = json_decode($updatedCurrencyJson);
        $this->assertEquals($currency, $updatedCurrency->currency);
        $this->assertEquals($value, $updatedCurrency->value);
        $this->assertEquals(CurrencyConverter::ERROR_UNSUPORTED_CURRENCY, $updatedCurrency->error);
    }

    /**
     * unit test getConvertedValue.
     *
     * @return void
     */
    public function testUpdateCurrency()
    {
        $this->clearCache();
        $model = new CurrencyConverter();

        $currency = 'USD';
        $value = 13.13;

        $updatedCurrencyJson = $model->updateCurrency($currency, $value);
        $updatedCurrency = json_decode($updatedCurrencyJson);
        $this->assertEquals($currency, $updatedCurrency->currency);
        $this->assertTrue($updatedCurrency->hasAutomaticUpdate);
    }
}
