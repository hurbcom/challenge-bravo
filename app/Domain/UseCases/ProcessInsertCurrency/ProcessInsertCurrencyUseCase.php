<?php

namespace App\Domain\UseCases\ProcessInsertCurrency;

use App\Domain\Entity\Currency\CurrencyInsertRepository;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use App\Domain\Entity\Currency\CurrencyEntity;
use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyOutputDto;
use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyInputDto;

class ProcessInsertCurrencyUseCase
{
    protected $insertCurrencyRepository;
    protected $getCurrenciesRepository;

    public function __construct(
        CurrencyInsertRepository $insertCurrencyRepository,
        CurrencygetAllRepository $getCurrenciesRepository
    ) {
        $this->repository = $insertCurrencyRepository;
        $this->getCurrenciesRepository = $getCurrenciesRepository;
    }

    public function insertCurrency(AddCurrencyInputDto $inputData): AddCurrencyOutputDto
    {
        $currency = new CurrencyEntity($inputData->indentificationName, 0);
        if (!$currency->isIndentificationNameWithThreeLetters()) {
            $outputDto = new AddCurrencyOutputDto('error', 'currency indentification name does not follow rules');

            return $outputDto;
        }

        $persistData = $this->persistData($currency->getIndentificationName());

        $response = $this->createReturn($persistData);

        return $response;
    }

    public function persistData($currencyIndentificationName)
    {
        $currencies = $this->getCurrenciesRepository->getAll();

        if (in_array($currencyIndentificationName, $currencies)) {
            return false;
        }

        return $this->repository->insert($currencyIndentificationName);
    }

    public function createReturn($data): AddCurrencyOutputDto
    {
        if ($data !== false) {
            $outputDto = new AddCurrencyOutputDto('success', $data);

            return $outputDto;
        }

        $outputDto = new AddCurrencyOutputDto('error', $data);

        return $outputDto;
    }
}
