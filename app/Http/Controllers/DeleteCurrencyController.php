<?php

namespace App\Http\Controllers;

use App\Domain\UseCases\ProcessDeleteCurrency\ProcessDeleteCurrencyUseCase;
use App\Domain\UseCases\ProcessDeleteCurrency\Dto\DeleteCurrencyInputDto;
use App\Adapter\Repository\DeleteCurrencyAdatperRepository;
use App\Adapter\Repository\ShowCurrenciesAdatperRepository;

class DeleteCurrencyController extends Controller
{
    protected $deleteCurrencyrepository;
    protected $showAllCurrencyrepository;

    public function __construct(
        DeleteCurrencyAdatperRepository $deleteCurrencyrepository,
        ShowCurrenciesAdatperRepository $showAllCurrencyrepository
    ) {
        $this->deleteCurrencyrepository = $deleteCurrencyrepository;
        $this->showAllCurrencyrepository = $showAllCurrencyrepository;
    }

    public function handle($indentificationName)
    {
        $useCase = new ProcessDeleteCurrencyUseCase(
            $this->deleteCurrencyrepository,
            $this->showAllCurrencyrepository
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
