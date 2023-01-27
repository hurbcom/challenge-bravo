<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CurrencyRequest;

use App\Repositories\CurrencyRepository;
use App\Traits\ResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Helper\SingleCurrency;


class CurrencyController extends Controller
{
    /**
     * Resposta em caso de resposta de retorno
     */
    use ResponseTrait;

    /**
     * Currency Repository class
     */
    public $currencyRepository;

    public function __construct(CurrencyRepository $currencyRepository)
    {
        $this->currencyRepository = $currencyRepository;
    }

    /* 
    Função para listar moedas cadastradas no banco 
    */
    public function index(): JsonResponse
    {
        try {
            $data = $this->currencyRepository->getAll();
            return $this->responseSuccess($data, 'Segue lista de moedas', 200);
        } catch (\Exception $e) {
            return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /* 
    Função para incluir moedas no banco 
    */
    public function store(CurrencyRequest $request): JsonResponse
    {   
        try{
            $checkUniqueCurrency = new SingleCurrency();
            $response = $checkUniqueCurrency->checkUniqueCurrency($request, $id = null);

            if($response == false)
            {
                $currency = $this->currencyRepository->create($request->all());
                return $this->responseSuccess($currency, 'Nova moeda cadastrada com sucesso!', 200);

            }
            return response()->json($response); 

        } catch (\Exception $exception) {
            return $this->responseError(null, $exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
               
    }

    /* 
    Função para atualizar moedas cadastradas no banco 
    */
    public function update(CurrencyRequest $request, $id): JsonResponse
    {
        try {            
            $checkUniqueCurrency = new SingleCurrency();
            $response = $checkUniqueCurrency->checkUniqueCurrency($request, $id);

            if($response == false)
            {
                $data = $this->currencyRepository->update($id, $request->all());
                if($data == 'TRUE_COIN')
                {
                    return $this->responseError(null, 'Você não pode editar uma moeda verdadeira. Delete apenas as que criou');
                }
                return $this->responseSuccess($data, 'Moeda atualizada com sucesso!', 200);

            }
            return response()->json($response);
            
        } catch (\Exception $e) {
            return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
                
    }

    /* 
    Função para deletar moedas cadastradas no banco 
    */
    public function destroy($id)
    {
        try {
            $currency =  $this->currencyRepository->getByID($id);
            if (empty($currency)) {
                return $this->responseError(null, 'Moeda inexistente no banco de dados', Response::HTTP_NOT_FOUND);
            }

            $deleted = $this->currencyRepository->delete($id);

            if (!$deleted) {
                return $this->responseError(null, 'Falha ao deletar a moeda.', Response::HTTP_INTERNAL_SERVER_ERROR);
            }
          
            if ($deleted == 'REAL_COIN') {
                return $this->responseError(null, 'Você não pode deletar uma moeda verdadeira.', Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            return $this->responseSuccess($currency, 'Moeda deletada com sucesso!');
            
        } catch (\Exception $e) {
            return $this->responseError(null, $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    
}
