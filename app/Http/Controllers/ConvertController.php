<?php

namespace App\Http\Controllers;
use App\Services\CurrencyApiService;

use App\Traits\ResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ConvertController extends Controller
{
    /**
     * Resposta em caso de resposta de retorno
     */
    use ResponseTrait;

    /**
     * Resposta em caso de resposta de retorno
     */
    private $currencyApi;

    public function __construct(CurrencyApiService $currencyApi)
    {
        $this->currencyApi = $currencyApi;
    }

    /**
     * Função que converte o valor das moedas 
     */
    public function index($from, $to, $amount)
    {   
        try {
            $response = $this->currencyApi->convert($from, $to, $amount);
            return response()->json($response); 
        } catch (\Exception $e) {
            return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Função que checa moedas existentes na api
     */
    public function currenciesSupported(): JsonResponse
    {
        try {
            $response = $this->currencyApi->supported();
            return response()->json($response); 
        } catch (\Exception $e) {
            return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Função que checa o valor atualizado das moedas existentes na api e atualiza no banco a cada minuto
     */
    public function latestRates()
    {
        return $this->currencyApi->automaticUpdate();
        try {
            $response = $this->currencyApi->updated();
            return response()->json($response); 
        } catch (\Exception $e) {
            return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }  
    }
}
