<?php

namespace App\Http\Controllers;

use App\Domain\UseCases\ProcessConvert\ProcessConvertUseCase;
use App\Domain\UseCases\ProcessConvert\Dto\ConvertInputDto;
use App\Adapter\Repository\ConventerAdatperRepository;
use App\Adapter\Repository\CurrencyRateAdapterRepository;
use App\Adapter\Repository\ShowCurrenciesAdatperRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConverterController extends Controller
{
    protected $currencyRateRepository;
    protected $showAllCurrencyrepository;

    public function __construct(
        CurrencyRateAdapterRepository $currencyRateRepository,
        ShowCurrenciesAdatperRepository $showAllCurrencyrepository
    ) {
        $this->currencyRateRepository = $currencyRateRepository;
        $this->showAllCurrencyrepository = $showAllCurrencyrepository;
    }

    public function handle(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'currencyFrom' => 'required|string|max:3',
                'currencyTo' => 'required|string|max:3',
                'amount' => 'required|numeric',
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

        $useCase = new ProcessConvertUseCase(
            $this->currencyRateRepository,
            $this->showAllCurrencyrepository,
        );

        $inputData = new ConvertInputDto(
            $request->input('currencyFrom'),
            $request->input('currencyTo'),
            $request->input('amount')
        );

        $result = $useCase->execute($inputData);

        return response()->json([
            'data' => $result
        ]);
    }
}
