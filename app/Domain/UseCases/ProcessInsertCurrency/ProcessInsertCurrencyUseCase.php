<?php

namespace App\Domain\UseCases\ProcessInsertCurrency;

use App\Domain\Entity\Currency\CurrencyInsertRepository;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use App\Domain\Entity\Currency\CurrencyRateRepository;
use App\Domain\Entity\Currency\FictionalCurrencyDataInfoRepository;
use App\Domain\Entity\Currency\CurrencyEntity;
use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyOutputDto;
use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyInputDto;

class ProcessInsertCurrencyUseCase
{
    protected $insertCurrencyRepository;
    protected $getCurrenciesRepository;
    protected $getCurrencyRateRepository;
    protected $fictionalCurrencyRepository;

    public function __construct(
        CurrencyInsertRepository $insertCurrencyRepository,
        CurrencygetAllRepository $getCurrenciesRepository,
        CurrencyRateRepository $getCurrencyRateRepository,
        FictionalCurrencyDataInfoRepository $fictionalCurrencyRepository
    ) {
        $this->repository = $insertCurrencyRepository;
        $this->getCurrenciesRepository = $getCurrenciesRepository;
        $this->getCurrencyRateRepository = $getCurrencyRateRepository;
        $this->fictionalCurrencyRepository = $fictionalCurrencyRepository;
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

            $persistData = $this->persistInsertFictionalCurrencyData($currency->getIndentificationName());

            if ($persistData instanceof AddCurrencyOutputDto) {
                return $persistData;
            }
        }

        $persistData = $this->persistInsertCurrencyData($currency->getIndentificationName(), $exchangeRate);

        $response = $this->createReturn($persistData);

        return $response;
    }

    public function persistInsertCurrencyData($currencyIndentificationName, $exchangeRate)
    {
        $currencies = $this->getCurrenciesRepository->getAll();

        if (in_array($currencyIndentificationName, $currencies)) {
            $outputDto = new AddCurrencyOutputDto('error', 'currency already exists');

            return $outputDto;
        }

        return $this->repository->insert($currencyIndentificationName, $exchangeRate);
    }

    public function persistInsertFictionalCurrencyData($currencyIndentificationName)
    {
        $currencies = $this->fictionalCurrencyRepository->getAll();

        if (in_array($currencyIndentificationName, $currencies)) {
            $outputDto = new AddCurrencyOutputDto('error', 'currency already exists');

            return $outputDto;
        }

        return $this->fictionalCurrencyRepository->insert($currencyIndentificationName);
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
