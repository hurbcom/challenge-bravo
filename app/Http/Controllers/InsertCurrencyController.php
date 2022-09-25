<?php

namespace App\Http\Controllers;

use App\Domain\UseCases\ProcessInsertCurrency\ProcessInsertCurrencyUseCase;
use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyInputDto;
use App\Adapter\Repository\AddCurrencyAdatperRepository;
use App\Adapter\Repository\ShowCurrenciesAdatperRepository;
use App\Adapter\Repository\CurrencyRateAdapterRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InsertCurrencyController extends Controller
{
    protected $addCurrencyrepository;
    protected $showAllCurrencyrepository;
    protected $getCurrencyRateRepository;

    public function __construct(
        AddCurrencyAdatperRepository $addCurrencyrepository,
        ShowCurrenciesAdatperRepository $showAllCurrencyrepository,
        CurrencyRateAdapterRepository $getCurrencyRateRepository
    ) {
        $this->addCurrencyrepository = $addCurrencyrepository;
        $this->showAllCurrencyrepository = $showAllCurrencyrepository;
        $this->getCurrencyRateRepository = $getCurrencyRateRepository;
    }

    public function handle(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'indentificationName' => 'required|string|max:3',
                'isFictional' => 'required|boolean',
                'baseCurrencyForFictionalType' => 'required|string|max:3',
                'valueBasedOnRealCurrency' => 'required|numeric'
            ],
            [
                'required' => ':attribute should be declared in body',
                'size' => ':attribute should be size three',
                'type' => ':attribute should be a string',

            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'data' => $validator->messages()
            ]);
        }

        $useCase = new ProcessInsertCurrencyUseCase(
            $this->addCurrencyrepository,
            $this->showAllCurrencyrepository,
            $this->getCurrencyRateRepository
        );

        $inputData = new AddCurrencyInputDto(
            $request->input('indentificationName'),
            $request->input('isFictional'),
            $request->input('baseCurrencyForFictionalType'),
            $request->input('valueBasedOnRealCurrency'),
        );

        $result = $useCase->insertCurrency($inputData);

        return response()->json([
            'data' => $result
        ]);
    }
}
