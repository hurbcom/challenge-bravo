<?php

namespace App\Domain\UseCases\ProcessShowCurrencies;

use App\Domain\Entity\Currency\CurrencygetAllRepository;
use App\Domain\UseCases\ProcessShowCurrencies\Dto\ShowCurrenciesOutputDto;

class ProcessShowCurrenciesUseCase
{
    private $repository;

    public function __construct(
        CurrencygetAllRepository $repository,
    ) {
        $this->repository = $repository;
    }

    public function showCurrencies()
    {
        $getCurrenciesStored = $this->repository->getAll();

        $response = $this->createReturn($getCurrenciesStored);

        return $response;
    }

    public function createReturn($data)
    {
        if (!$data) {
            $outputDto = new ShowCurrenciesOutputDto('error', 'a error has occured while list the currencies');

            return $outputDto;
        }

        $outputDto = new ShowCurrenciesOutputDto('success', $data);

        return $outputDto;
    }
}
