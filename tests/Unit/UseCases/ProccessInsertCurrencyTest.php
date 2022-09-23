<?php

namespace Tests\Unit\UseCases;

use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyInputDto;

use App\Domain\UseCases\ProcessInsertCurrency\ProcessInsertCurrencyUseCase;
use App\Domain\Entity\Currency\CurrencyInsertRepository;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use Tests\TestCase;

class ProccessInsertCurrencyTest extends TestCase
{
    // private $insertCurrencyRepositoryMock;
    // private $getCurrenciesRepositoryMock;

    // protected function setUp(): void
    // {
    //     parent::setUp();

    //     $this->insertCurrencyRepositoryMock = $this->mock(CurrencyInsertRepository::class);
    //     $this->insertCurrencyRepositoryMock->shouldReceive('insert')->andReturn('Insertion ocurred with success');

    //     $this->getCurrenciesRepositoryMock = $this->mock(CurrencygetAllRepository::class);
    //     $this->getCurrenciesRepositoryMock->shouldReceive('getAll')->andReturn(['ABC', 'DEF']);
    // }

    // public function testShouldNotInsertCurrencyWithutDtoInputData()
    // {
    // }

    // public function testShouldInsertReturnInDtoOutputFormatonResponse()
    // {
    // }


    public function testShouldNotAcceptInsertCurrencyWithDifferentSizeThreeIndentificationName()
    {
        $formatInputData = new AddCurrencyInputDto('ABCD');

        $proccessInsertCurrency = new ProcessInsertCurrencyUseCase(
            $this->insertCurrencyRepositoryMock,
            $this->getCurrenciesRepositoryMock
        );

        $result = $proccessInsertCurrency->insertCurrency($formatInputData);

        $this->assertEquals(
            $result['status'],
            'error'
        );
    }
}
