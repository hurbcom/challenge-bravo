<?php

namespace App\Http\Controllers;

use App\Http\Requests\CurrencyRequest;
use App\Http\Requests\MoedaRequest;
use App\Repositories\MoedaRepository;
use App\Service\MoedaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MoedaController extends BaseController
{
    public function __construct(MoedaRepository $moedaRepository, MoedaRequest $rules)
    {
        parent::__construct($moedaRepository, $rules);
    }

    /**
     * @return void|JsonResponse
     */
    public function validatesRequest(Request $request, string $method)
    {
        try {
            $this->validate($request, CurrencyRequest::$method());
        } catch (ValidationException $e) {
            return $this->apiResponse(false, 'Parametros incorretos.', $e->errors(), 400);
        }
    }

    public function currencyConverter(Request $request): JsonResponse
    {
        $this->validatesRequest($request, 'conversion');

        try {
            $moedaService = new MoedaService($request->input('to'), $request->input('from'), $request->input('amount'));

            return $this->apiResponse(true, 'Dados retornados com sucesso', $moedaService->getConversion());
        } catch (ModelNotFoundException | NotFoundHttpException $e) {
            return $this->apiResponse(false, $e->getMessage(), [], 404);
        } catch (\Throwable $e) {
            return $this->apiResponse(false, $e->getMessage(), [], 500);
        }
    }

    public function currencyQuotation(Request $request): JsonResponse
    {
        $this->validatesRequest($request, 'quotation');

        try {
            $moedaService = new MoedaService($request->input('to'), $request->input('from'), $request->input('amount'));

            return $this->apiResponse(true, 'Dados retornados com sucesso', $moedaService->getQuotation());
        } catch (ModelNotFoundException | NotFoundHttpException $e) {
            return $this->apiResponse(false, $e->getMessage(), [], 404);
        } catch (\Throwable $e) {
            return $this->apiResponse(false, $e->getMessage(), [], 500);
        }
    }
}
