<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestInterface;
use App\Repositories\RepositoryAbstract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class BaseController extends Controller
{
    protected $repository;
    protected $rulesClass;

    public function __construct(RepositoryAbstract $repository, RequestInterface $rulesClass)
    {
        $this->repository = $repository;
        $this->rulesClass = $rulesClass;
    }

    public function apiResponse(bool $success = true, string $message = null, array $data = [], int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    public function makeValidation(array $requestData, array $rules)
    {
        $validator = Validator::make($requestData, $rules);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }
    }

    /**
     * Display a listing of the resource.
     *
     */
    public function index(): JsonResponse
    {
        try {
            $data = $this->repository->all();
            
            return $this->apiResponse(true, 'Dados retornados com sucesso.', $data->toArray());
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return $this->apiResponse(false, 'Falha no retorno dos dados.', [], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $this->makeValidation($request->all(), $this->rulesClass::rules());
        } catch (ValidationException $e) {
            return $this->apiResponse(false, $e->getMessage(), $e->errors(), 400);
        }

        try {
            $data = $this->repository->create($request->all());
            
            return $this->apiResponse(true, 'Dados criados com sucesso.', $data->toArray());
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return $this->apiResponse(false, 'Falha ao criar dados.', [], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $uid
     */
    public function show($uid)
    {
        try {
            $data = $this->repository->find($uid);
            
            if (is_null($data)) {
                return $this->apiResponse(false, 'Dados não encontrados.', [], 404);
            }
            
            return $this->apiResponse(true, 'Dados retornados com sucesso.', $data->toArray());
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return $this->apiResponse(false, 'Falha ao criar dados.', [], 500);
        }
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $uid
     */
    public function update(Request $request, $uid)
    {
        try {
            $this->makeValidation($request->all(), $this->rulesClass::rules());
        } catch (ValidationException $e) {
            return $this->apiResponse(false, $e->getMessage(), $e->errors(), 400);
        }
        
        try {
            $data = $this->repository->find($uid);
            
            if (is_null($data)) {
                return $this->apiResponse(false, 'Dados não encontrados.', [], 404);
            }
            
            $data->fill($request->all());

            return $this->apiResponse(true, 'Dados retornados com sucesso.', $data->toArray());
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return $this->apiResponse(false, 'Falha ao criar dados.', [], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $uid
     */
    public function destroy($uid)
    {
        try {
            $data = $this->repository->destroy($uid);
            
            if (!$data) {
                return $this->apiResponse(false, 'Dados não encontrados.', [], 404);
            }

            return $this->apiResponse(true, 'Dados retornados com sucesso.', []);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return $this->apiResponse(false, 'Falha ao criar dados.', [], 500);
        }
    }
}
