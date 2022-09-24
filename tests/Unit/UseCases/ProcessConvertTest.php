<?php

namespace Tests\Unit\UseCases;

use App\Domain\UseCases\ProcessConvert\Dto\ConvertInputDto;
use App\Domain\UseCases\ProcessConvert\ProcessConvertUseCase;
use App\Domain\Entity\Currency\CurrencyRateRepository;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use Tests\TestCase;

class ProcessConvertTest extends TestCase
{
    private $currencyRateRepositoryMock;
    private $getCurrenciesRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->currencyRateRepositoryMock = $this->mock(CurrencyRateRepository::class);
        $this->currencyRateRepositoryMock->shouldReceive('get')->andReturn(0.9998);

        $this->getCurrenciesRepositoryMock = $this->mock(CurrencygetAllRepository::class);
        $this->getCurrenciesRepositoryMock->shouldReceive('getAll')->andReturn(['ABC', 'DEF']);
    }

    // public function testShouldNotConvertIfAmountIsDifferentThanFloatType()
    // {
    //     $formatInputData = new ConvertInputDto('ABC', 'DEF', '100');

    //     $processConvert = new ProcessConvertUseCase(
    //         $this->currencyRateRepositoryMock,
    //         $this->getCurrenciesRepositoryMock
    //     );

    //     $result = $processConvert->execute($formatInputData);

    //     $this->assertEquals(
    //         $result->status,
    //         'error'
    //     );
    // }

    public function testShouldNotConvertIfCurrenciesAreSame()
    {
        $formatInputData = new ConvertInputDto('ABC', 'ABC', 100);

        $processConvert = new ProcessConvertUseCase(
            $this->currencyRateRepositoryMock,
            $this->getCurrenciesRepositoryMock
        );

        $result = $processConvert->execute($formatInputData);

        $this->assertEquals(
            $result->status,
            'error'
        );
    }

    public function testShouldNorConvertIfCurrencyFromDontExist()
    {
        $formatInputData = new ConvertInputDto('GHI', 'DEF', 100);

        $processConvert = new ProcessConvertUseCase(
            $this->currencyRateRepositoryMock,
            $this->getCurrenciesRepositoryMock
        );

        $result = $processConvert->execute($formatInputData);

        $this->assertEquals(
            $result->status,
            'error'
        );
    }

    public function testShouldNotConvertIfCurrencyToDontExist()
    {
        $formatInputData = new ConvertInputDto('ABC', 'GHI', 100);

        $processConvert = new ProcessConvertUseCase(
            $this->currencyRateRepositoryMock,
            $this->getCurrenciesRepositoryMock
        );

        $result = $processConvert->execute($formatInputData);

        $this->assertEquals(
            $result->status,
            'error'
        );
    }

    public function testShouldConversionResultBeAFloatValue()
    {
        $formatInputData = new ConvertInputDto('ABC', 'DEF', 100);

        $processConvert = new ProcessConvertUseCase(
            $this->currencyRateRepositoryMock,
            $this->getCurrenciesRepositoryMock
        );

        $result = $processConvert->execute($formatInputData);

        $this->assertEquals(
            $result->status,
            'success'
        );

        $this->assertEquals(
            gettype($result->valueConverted),
            'double'
        );
    }
}
