<?php

namespace App\Domain\UseCases\ProcessDeleteCurrency;

use App\Domain\Entity\Currency\CurrencyDeleteRepository;
use App\Domain\Entity\Currency\CurrencygetAllRepository;
use App\Domain\Entity\Currency\FictionalCurrencyDataInfoRepository;
use App\Domain\UseCases\ProcessDeleteCurrency\Dto\DeleteCurrencyOutputDto;

class ProcessDeleteCurrencyUseCase
{
    private $repository;
    protected $getCurrenciesRepository;
    protected $fictionalCurrencyRepository;

    public function __construct(
        CurrencyDeleteRepository $repository,
        CurrencygetAllRepository $getCurrenciesRepository,
        FictionalCurrencyDataInfoRepository $fictionalCurrencyRepository
    ) {
        $this->repository = $repository;
        $this->getCurrenciesRepository = $getCurrenciesRepository;
        $this->fictionalCurrencyRepository = $fictionalCurrencyRepository;
    }

    public function deleteCurrency($inputData): DeleteCurrencyOutputDto
    {
        $persistData = $this->persistData($inputData->indentificationName);

        $response = $this->createReturn($persistData);

        return $response;
    }

    public function persistData($currencyIndentificationName)
    {
        $currencies = $this->getCurrenciesRepository->getAll();

        if (!in_array($currencyIndentificationName, $currencies)) {
            return false;
        }

        $fictionalCurrencies = $this->fictionalCurrencyRepository->getAll();

        if (!in_array($currencyIndentificationName, $fictionalCurrencies)) {
            return false;
        }

        $this->fictionalCurrencyRepository->delete($currencyIndentificationName);

        return $this->repository->delete($currencyIndentificationName);
    }

    public function createReturn($data): DeleteCurrencyOutputDto
    {
        if ($data !== false) {
            $outputDto = new DeleteCurrencyOutputDto('success', 'currency deleted with success');

            return $outputDto;
        }

        $outputDto = new DeleteCurrencyOutputDto('error', 'not possible to delete given value');

        return $outputDto;
    }
}
