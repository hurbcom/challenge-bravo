<?php

namespace App\Http\Controllers;

use App\Core\Actions\Currency\ConvertAction;
use App\Core\Actions\Currency\CreateAction;
use App\Core\Actions\Currency\DeleteAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class ConverterController
 * @package App\Http\Controllers
 */
class CurrencyController extends Controller
{
    /**
     * @param Request $request
     * @param ConvertAction $action
     * @return JsonResponse
     */
    public function convert(Request $request, ConvertAction $action): JsonResponse
    {
        $result = $action->run($request->query());

        return response()->json($result);
    }

    /**
     * @param Request $request
     * @param CreateAction $action
     * @return JsonResponse
     */
    public function create(Request $request, CreateAction $action)
    {
        $result = $action->run($request->all());

        return response()->json($result);
    }

    /**
     * @param string $id
     * @param DeleteAction $action
     * @return JsonResponse
     */
    public function delete(string $id, DeleteAction $action)
    {
        $result = $action->run(['id' => $id]);

        return response()->json($result);
    }
}