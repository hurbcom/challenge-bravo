<?php

namespace App\Http\Controllers;

use App\Domain\UseCases\ProcessDeleteCurrency\ProcessDeleteCurrencyUseCase;
use App\Domain\UseCases\ProcessDeleteCurrency\Dto\DeleteCurrencyInputDto;
use App\Adapter\Repository\DeleteCurrencyAdatperRepository;
use App\Adapter\Repository\ShowCurrenciesAdatperRepository;
use App\Adapter\Repository\FictionalCurrencyDataInfoAdatperRepository;

class DeleteCurrencyController extends Controller
{
    protected $deleteCurrencyrepository;
    protected $showAllCurrencyrepository;
    protected $fictionalCurrencyRepository;

    public function __construct(
        DeleteCurrencyAdatperRepository $deleteCurrencyrepository,
        ShowCurrenciesAdatperRepository $showAllCurrencyrepository,
        FictionalCurrencyDataInfoAdatperRepository $fictionalCurrencyRepository
    ) {
        $this->deleteCurrencyrepository = $deleteCurrencyrepository;
        $this->showAllCurrencyrepository = $showAllCurrencyrepository;
        $this->fictionalCurrencyRepository = $fictionalCurrencyRepository;
    }

    public function handle($indentificationName)
    {
        $useCase = new ProcessDeleteCurrencyUseCase(
            $this->deleteCurrencyrepository,
            $this->showAllCurrencyrepository,
            $this->fictionalCurrencyRepository
        );

        $inputData = new DeleteCurrencyInputDto(
            $indentificationName
        );

        $result = $useCase->deleteCurrency($inputData);

        return response()->json([
            'data' => $result
        ]);
    }
}
