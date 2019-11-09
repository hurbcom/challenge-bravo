<?php

namespace App\Http\Controllers;

use App\Core\Actions\Currency\ConvertAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class ConverterController
 * @package App\Http\Controllers
 */
class ConverterController extends Controller
{
    public function convert(Request $request, ConvertAction $action): JsonResponse
    {
        $result = $action->run($request->query());

        return response()->json($result);
    }
}