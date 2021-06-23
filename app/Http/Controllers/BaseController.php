<?php

namespace App\Http\Controllers;

use App\Repositories\RepositoryAbstract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BaseController extends Controller
{
    protected $repository;

    public function __construct(RepositoryAbstract $repository)
    {
        $this->repository = $repository;
    }

    public function apiResponse(bool $success = true, string $message = null, array $data = [], int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
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
            $data = $this->repository->create($request->all());
            
            return $this->apiResponse(true, 'Dados criados com sucesso.', $data);
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
            
            return $this->apiResponse(true, 'Dados retornados com sucesso.', $data);
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
            $data = $this->repository->find($uid);
            
            if (is_null($data)) {
                return $this->apiResponse(false, 'Dados não encontrados.', [], 404);
            }
            
            $data->fill($request->all());

            return $this->apiResponse(true, 'Dados retornados com sucesso.', $data);
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
