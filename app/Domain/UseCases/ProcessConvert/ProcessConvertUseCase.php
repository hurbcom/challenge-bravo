<?php

namespace App\Domain\UseCases\ProcessConvert;

use App\Domain\Entity\Currency\CurrencyRateRepository;
use App\Domain\Entity\Currency\CurrencyEntity;
use App\Domain\Entity\Converter\ConverterEntity;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use App\Domain\UseCases\ProcessConvert\Dto\ConvertOutputDto;

class ProcessConvertUseCase
{
    protected $currencyRateRepository;
    protected $getCurrenciesRepository;

    public function __construct(
        CurrencyRateRepository $currencyRateRepository,
        CurrencygetAllRepository $getCurrenciesRepository
    ) {
        $this->currencyRateRepository = $currencyRateRepository;
        $this->getCurrenciesRepository = $getCurrenciesRepository;
    }

    public function execute($inputData): ConvertOutputDto
    {
        $currenciesStored = $this->verifyCurrenciesExistence($inputData);

        if ($currenciesStored instanceof ConvertOutputDto) {
            return $currenciesStored;
        }

        $getCurrencyFromExchangeRate = $this->currencyRateRepository->get($inputData->currencyFrom);
        $getCurrencyToExchangeRate = $this->currencyRateRepository->get($inputData->currencyTo);

        $currencyFrom = new CurrencyEntity($inputData->currencyFrom, $getCurrencyFromExchangeRate);
        $currencyTo = new CurrencyEntity($inputData->currencyTo, $getCurrencyToExchangeRate);
        $conversionEntry = new ConverterEntity($currencyFrom, $currencyTo, $inputData->amount);

        $conversionValidated = $this->validateCurrencies($conversionEntry);

        if ($conversionValidated instanceof ConvertOutputDto) {
            return $conversionValidated;
        }

        $convert = $this->convert($conversionValidated);

        return $convert;
    }

    public function convert($converter): ConvertOutputDto
    {
        $result = $converter->CurrencyConversion();

        $outputDto = new ConvertOutputDto('success', 'conversion made with success', $result);

        return $outputDto;
    }

    public function validateCurrencies($conversionEntry): ConverterEntity|ConvertOutputDto
    {
        $isValidAmount = $conversionEntry->isValidAmount();
        if ($isValidAmount === false) {
            $outputDto = new ConvertOutputDto('error', 'invalid amount value', 0);

            return $outputDto;
        }

        $isSameCurrencies = $conversionEntry->isSameCurrecies();
        if ($isSameCurrencies) {
            $outputDto = new ConvertOutputDto('error', 'same currency conversion', 0);

            return $outputDto;
        }

        return $conversionEntry;
    }

    public function verifyCurrenciesExistence($data): null|ConvertOutputDto
    {
        $currenciesStoredInDataBase = $this->getCurrenciesRepository->getAll();

        if (!in_array($data->currencyFrom, $currenciesStoredInDataBase)) {
            $outputDto = new ConvertOutputDto('error', 'currency from not found', 0);

            return $outputDto;
        }

        if (!in_array($data->currencyTo, $currenciesStoredInDataBase)) {
            $outputDto = new ConvertOutputDto('error', 'currency to not found', 0);

            return $outputDto;
        }

        return null;
    }
}
