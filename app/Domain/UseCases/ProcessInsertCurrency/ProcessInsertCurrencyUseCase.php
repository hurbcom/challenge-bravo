<?php

namespace App\Domain\UseCases\ProcessInsertCurrency;

use App\Domain\Entity\Currency\CurrencyInsertRepository;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use App\Domain\Entity\Currency\CurrencyRateRepository;
use App\Domain\Entity\Currency\CurrencyInsertRateToFictionalRepository;
use App\Domain\Entity\Currency\CurrencyEntity;
use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyOutputDto;
use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyInputDto;

class ProcessInsertCurrencyUseCase
{
    protected $insertCurrencyRepository;
    protected $getCurrenciesRepository;
    protected $getCurrencyRateRepository;

    public function __construct(
        CurrencyInsertRepository $insertCurrencyRepository,
        CurrencygetAllRepository $getCurrenciesRepository,
        CurrencyRateRepository $getCurrencyRateRepository,
    ) {
        $this->repository = $insertCurrencyRepository;
        $this->getCurrenciesRepository = $getCurrenciesRepository;
        $this->getCurrencyRateRepository = $getCurrencyRateRepository;
    }

    public function insertCurrency(AddCurrencyInputDto $inputData): AddCurrencyOutputDto
    {
        $exchangeRate = 0;
        $currency = new CurrencyEntity($inputData->indentificationName, 0);
        if (!$currency->isIndentificationNameWithThreeLetters()) {
            $outputDto = new AddCurrencyOutputDto('error', 'currency indentification name does not follow rules');

            return $outputDto;
        }

        if ($inputData->isFictional) {
            $exchangeRateBaseCurrency = $this->getCurrencyRateRepository->get($inputData->baseCurrencyForFictionalType);

            $exchangeRate = $currency->getCurrencyExchangeForFictionalType(
                $inputData->valueBasedOnRealCurrency,
                $exchangeRateBaseCurrency
            );
        }

        $persistData = $this->persistData($currency->getIndentificationName(), $exchangeRate);

        $response = $this->createReturn($persistData);

        return $response;
    }

    public function persistData($currencyIndentificationName, $exchangeRate)
    {
        $currencies = $this->getCurrenciesRepository->getAll();

        if (in_array($currencyIndentificationName, $currencies)) {
            $outputDto = new AddCurrencyOutputDto('error', 'currency alredy exists');

            return $outputDto;
        }

        return $this->repository->insert($currencyIndentificationName, $exchangeRate);
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
