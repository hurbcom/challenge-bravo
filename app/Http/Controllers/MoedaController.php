<?php

namespace App\Http\Controllers;

use App\Http\Requests\MoedaRequest;
use App\Repositories\MoedaRepository;
use App\Service\MoedaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MoedaController extends BaseController
{
    public function __construct(MoedaRepository $moedaRepository, MoedaRequest $rules)
    {
        parent::__construct($moedaRepository, $rules);
    }

    public function converteMoedas(Request $request): JsonResponse
    {
        try {
            $moedaService = new MoedaService($request->input('to'), $request->input('from'));
            $convertedValue = $moedaService->getConversion($request->input('amount'));

            return $this->apiResponse(true, 'Dados retornados com sucesso', $convertedValue);
        } catch (\Throwable $th) {
            return $this->apiResponse(false, $th->getMessage(), []);
        }        
    }
}
