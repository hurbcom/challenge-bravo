<?php

namespace Tests\Unit\UseCases;

use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyInputDto;

use App\Domain\UseCases\ProcessInsertCurrency\ProcessInsertCurrencyUseCase;
use App\Domain\Entity\Currency\CurrencyInsertRepository;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use App\Domain\Entity\Currency\CurrencyRateRepository;
use App\Domain\Entity\Currency\FictionalCurrencyDataInfoRepository;
use Tests\TestCase;

class ProcessInsertCurrencyTest extends TestCase
{
    private $insertCurrencyRepositoryMock;
    private $getCurrenciesRepositoryMock;
    private $currencyRateRepository;
    private $fictionalDataInfo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->insertCurrencyRepositoryMock = $this->mock(CurrencyInsertRepository::class);
        $this->insertCurrencyRepositoryMock->shouldReceive('insert')->andReturn('Insertion ocurred with success');

        $this->getCurrenciesRepositoryMock = $this->mock(CurrencygetAllRepository::class);
        $this->getCurrenciesRepositoryMock->shouldReceive('getAll')->andReturn(['ABC', 'DEF']);

        $this->currencyRateRepository = $this->mock(CurrencyRateRepository::class);
        $this->currencyRateRepository->shouldReceive('get')->andReturn(false);

        $this->fictionalDataInfo = $this->mock(FictionalCurrencyDataInfoRepository::class);
        $this->fictionalDataInfo->shouldReceive('getAll')->andReturn(['ABC', 'DEF']);
        $this->fictionalDataInfo->shouldReceive('delete')->andReturn(false);
    }

    public function testShouldNotAcceptInsertCurrencyWithDifferentSizeThreeIndentificationName()
    {
        $formatInputData = new AddCurrencyInputDto('ABCD', false, '', 0);

        $proccessInsertCurrency = new ProcessInsertCurrencyUseCase(
            $this->insertCurrencyRepositoryMock,
            $this->getCurrenciesRepositoryMock,
            $this->currencyRateRepository,
            $this->fictionalDataInfo
        );

        $result = $proccessInsertCurrency->insertCurrency($formatInputData);

        $this->assertEquals(
            $result->status,
            'error'
        );
    }
}
