<?php

namespace App\Http\Controllers;

use App\Domain\UseCases\ProcessShowCurrencies\ProcessShowCurrenciesUseCase;
use App\Adapter\Repository\ShowCurrenciesAdatperRepository;

class ShowCurrenciesController extends Controller
{
    protected $repository;

    public function __construct(
        ShowCurrenciesAdatperRepository $repository,
    ) {
        $this->repository = $repository;
    }

    public function handle()
    {
        $useCase = new ProcessShowCurrenciesUseCase(
            $this->repository
        );

        $result = $useCase->showCurrencies();

        return response()->json([
            'data' => $result
        ]);
    }
}
