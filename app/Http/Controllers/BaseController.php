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
    const CREATE = 0;
    const UPDATE = 1;

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

    public function makeValidation(array $requestData, int $type)
    {
        $rules = $this->makeRules($type);

        $validator = Validator::make($requestData, $rules);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }
    }

    public function makeRules(int $type): array
    {
        switch ($type) {
            case self::CREATE:
                return $this->rulesClass::create();
                break;
            case self::UPDATE:
                return $this->rulesClass::update();
                break;
            default:
                return [];
                break;
        }
    }

    /**
     * Display a listing of the resource.
     *
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $data = [];
            
            if ($request->has('paginate')) {
                $data = $this->repository->paginate($request->get('paginate'));
            } else {
                $data = $this->repository->all();
            }
            
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
            $this->makeValidation($request->all(), self::CREATE);
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
            $searchKey = $this->repository->getModel()->getRouteKeyName();
            
            $data = $searchKey != $this->repository->getModel()->getKeyName() ? $this->repository->findBy($searchKey, $uid) : $this->repository->find($uid);
            
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
            $this->makeValidation($request->all(), self::UPDATE);
        } catch (ValidationException $e) {
            return $this->apiResponse(false, $e->getMessage(), $e->errors(), 400);
        }

        try {
            $searchKey = $this->repository->getModel()->getRouteKeyName();
            
            $data = $searchKey != $this->repository->getModel()->getKeyName() ? $this->repository->findBy($searchKey, $uid) : $this->repository->find($uid);
            
            if (is_null($data)) {
                return $this->apiResponse(false, 'Dados não encontrados.', [], 404);
            }
            
            $data->fill($request->all());
            $data->save();

            return $this->apiResponse(true, 'Dados atualizados com sucesso.', $data->toArray());
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
            $searchKey = $this->repository->getModel()->getRouteKeyName();
            
            $data = $searchKey != $this->repository->getModel()->getKeyName() ? $this->repository->deleteBy($searchKey, $uid) : $this->repository->destroy($uid);            
            
            if (!$data) {
                return $this->apiResponse(false, 'Dados não encontrados.', [], 404);
            }

            return $this->apiResponse(true, 'Dados removidos com sucesso.', []);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return $this->apiResponse(false, 'Falha ao criar dados.', [], 500);
        }
    }
}
