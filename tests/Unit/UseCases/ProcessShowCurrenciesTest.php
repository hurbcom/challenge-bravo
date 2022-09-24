<?php

namespace Tests\Unit\UseCases;

use App\Domain\UseCases\ProcessShowCurrencies\ProcessShowCurrenciesUseCase;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use Tests\TestCase;

class ProcessShowCurrenciesTest extends TestCase
{
    private $getCurrenciesRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->getCurrenciesRepositoryMock = $this->mock(CurrencygetAllRepository::class);
    }

    public function testShoulReturnErrorInNoCurrenciesListError()
    {
        $this->getCurrenciesRepositoryMock->shouldReceive('getAll')->andReturn(false);
        $proccessInsertCurrency = new ProcessShowCurrenciesUseCase(
            $this->getCurrenciesRepositoryMock
        );

        $result = $proccessInsertCurrency->showCurrencies();

        $this->assertEquals(
            $result->status,
            'error'
        );
    }
}
