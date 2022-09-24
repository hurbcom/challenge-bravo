<?php

namespace App\Http\Controllers;

use App\Domain\UseCases\ProcessInsertCurrency\ProcessInsertCurrencyUseCase;
use App\Domain\UseCases\ProcessInsertCurrency\Dto\AddCurrencyInputDto;
use App\Adapter\Repository\AddCurrencyAdatperRepository;
use App\Adapter\Repository\ShowCurrenciesAdatperRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InsertCurrencyController extends Controller
{
    protected $addCurrencyrepository;
    protected $showAllCurrencyrepository;

    public function __construct(
        AddCurrencyAdatperRepository $addCurrencyrepository,
        ShowCurrenciesAdatperRepository $showAllCurrencyrepository
    ) {
        $this->addCurrencyrepository = $addCurrencyrepository;
        $this->showAllCurrencyrepository = $showAllCurrencyrepository;
    }

    public function handle(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'indentificationName' => 'required|string|max:3',
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
        );

        $inputData = new AddCurrencyInputDto(
            $request->input('indentificationName')
        );

        $result = $useCase->insertCurrency($inputData);

        return response()->json([
            'data' => $result
        ]);
    }
}
