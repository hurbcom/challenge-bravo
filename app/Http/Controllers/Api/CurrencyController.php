<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConvertRequest;
use App\Http\Requests\CurrencyRequest;
use App\Http\Resources\CurrencyResource;
use App\Services\CurrencyService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CurrencyController extends Controller
{
    private $currencyService;

    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }

    public function index() : ResourceCollection
    {
        $currencies = $this->currencyService->getCurrencies();

        return CurrencyResource::collection($currencies);
    }

    public function store(CurrencyRequest $request)
    {
        try {
            $currency = $this->currencyService->storeNewCurrency($request->validated());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return new CurrencyResource($currency);
    }

    public function show($id)
    {
        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            return response()->json(['error' => 'ID must be a number.'], 400);
        }

        try {
            $currency = $this->currencyService->showCurrency((int)$id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }

        return new CurrencyResource($currency);
    }

    public function destroy($id) : JsonResponse
    {
        if (!filter_var($id, FILTER_VALIDATE_INT)) {
            return response()->json(['error' => 'ID must be a number.'], 400);
        }

        try {
            $currency = $this->currencyService->destroyCurrency((int)$id);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }

        if(!$currency) {
            return response()->json(['error' => 'Currency Not Found.'], 403);
        }

        return response()->json([], 204);
    }

    public function convertAmount(ConvertRequest $request) : JsonResponse
    {
        try {
            $result = $this->currencyService->convertAmount($request->validated());
            if ($result === '') {
                return response()->json(['error' => 'Currency Not Found.'], 404);
            }

            $amountConverted = [
                'amount'                  => $request['amount'],
                'currency'                => $request['from'],
                'amountConverted'         => $result,
                'currencyAmountConverted' => $request['to'],
            ];
            return response()->json($amountConverted);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
