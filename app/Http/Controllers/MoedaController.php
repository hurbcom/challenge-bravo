<?php

namespace App\Http\Controllers;

use App\Http\Requests\MoedaRequest;
use App\Repositories\MoedaRepository;
use App\Service\MoedaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MoedaController extends BaseController
{
    public function __construct(MoedaRepository $moedaRepository, MoedaRequest $rules)
    {
        parent::__construct($moedaRepository, $rules);
    }

    public function converteMoedas(Request $request): JsonResponse
    {
        try {
            $moedaService = new MoedaService($request->input('to'), $request->input('from'), $request->input('amount'));

            return $this->apiResponse(true, 'Dados retornados com sucesso', $moedaService->getConversion());
        } catch (ModelNotFoundException | NotFoundHttpException $e) {
            return $this->apiResponse(false, $e->getMessage(), [], 404);
        } catch (\Throwable $e) {
            return $this->apiResponse(false, $e->getMessage(), [], 500);
        }
    }
}
