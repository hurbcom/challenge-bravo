<?php

namespace Tests\Unit\UseCases;

use App\Domain\UseCases\ProcessDeleteCurrency\Dto\DeleteCurrencyInputDto;
use App\Domain\UseCases\ProcessDeleteCurrency\ProcessDeleteCurrencyUseCase;
use App\Domain\Entity\Currency\CurrencyDeleteRepository;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use Tests\TestCase;

class ProcessDeleteCurrencyTest extends TestCase
{
    private $deleteCurrencyRepositoryMock;
    private $getCurrenciesRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->deleteCurrencyRepositoryMock = $this->mock(CurrencyDeleteRepository::class);
        $this->deleteCurrencyRepositoryMock->shouldReceive('delete')->andReturn(false);

        $this->getCurrenciesRepositoryMock = $this->mock(CurrencygetAllRepository::class);
        $this->getCurrenciesRepositoryMock->shouldReceive('getAll')->andReturn(['ABC', 'DEF']);
    }

    public function testShoulReturnErrorInDeleteCurrencyNotStored()
    {
        $formatInputData = new DeleteCurrencyInputDto('ABCD');

        $proccessInsertCurrency = new ProcessDeleteCurrencyUseCase(
            $this->deleteCurrencyRepositoryMock,
            $this->getCurrenciesRepositoryMock
        );

        $result = $proccessInsertCurrency->deleteCurrency($formatInputData);

        $this->assertEquals(
            $result->status,
            'error'
        );
    }
}
