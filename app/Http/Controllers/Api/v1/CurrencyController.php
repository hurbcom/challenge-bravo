<?php

namespace App\Http\Controllers\Api\v1;

use App\Enums\CurrencyEnum;
use App\Helpers\ExceptionHelper;
use App\Http\Controllers\Api\ApiController;

use App\Http\Services\CurrencyService;
use Exception;
use Illuminate\Http\Request;
use App\Models\Currency;
use Illuminate\Http\JsonResponse;


class CurrencyController extends ApiController
{
    /**
     * Converts Currency.
     * @param Request $request
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function convertCurrency(Request $request): JsonResponse
    {
        try {
            $this->validate($request, CurrencyEnum::getConvertValidateRules(), CurrencyEnum::getValidateMessages());

            $to = $request->input('to');
            $from = $request->input('from');
            $amount = $request->input('amount');

            $currencyConverted = (new CurrencyService())->currencyConverter($to, $from, $amount);
            $return = response()->json($currencyConverted);
        } catch (Exception $exception) {
            $return = response()->json([
                'error' => ExceptionHelper::catchExceptionMessage($exception)
            ], ExceptionHelper::catchExceptionCode($exception));
        }

        return $return;
    }

    /**
     * Get All Currencies.
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function getCurrencies(): JsonResponse
    {
        try {
            $currecies = Currency::all();

            if(!$currecies){
                throw new Exception('Currencies not found', 404);
            }

            $return = response()->json($currecies);
        } catch (Exception $exception) {
            $return = response()->json([
                'error' => ExceptionHelper::catchExceptionMessage($exception)
            ], ExceptionHelper::catchExceptionCode($exception));
        }

        return $return;
    }

    /**
     * Get Currency.
     * @param int $id
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function getCurrency(int $id): JsonResponse
    {
        try {
            $currecy = (new CurrencyService())->getCurrencyIfExists($id);
            $return = response()->json($currecy);
        } catch (Exception $exception) {
            $return = response()->json([
                'error' => ExceptionHelper::catchExceptionMessage($exception)
            ], ExceptionHelper::catchExceptionCode($exception));
        }

        return $return;
    }

    /**
     * Create Currency.
     * @param Request $request
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function postCurrency(Request $request): JsonResponse
    {
        try {
            $this->validate($request, CurrencyEnum::getStoreValidateRules(), CurrencyEnum::getValidateMessages());

            $currency = new Currency();
            $currency->code = $request->code;
            $currency->price = $request->price;
            $currency->save();

            if(!$currency){
                throw new Exception('Currency cannot be created.', 400);
            }

            $return = response()->json($currency, 201);
        }
        catch (Exception $exception) {
            $return = response()->json([
                'error' => ExceptionHelper::catchExceptionMessage($exception)
            ], ExceptionHelper::catchExceptionCode($exception));
        }

        return $return;
    }

    /**
     * Update Currency.
     * @param Request $request
     * @param int id
     *
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateCurrencyPrice(Request $request, int $id): JsonResponse
    {
        try {
            $this->validate($request, CurrencyEnum::getStoreValidateRules('price'), CurrencyEnum::getValidateMessages());

            $currency = (new CurrencyService())->getCurrencyIfExists($id);
            $currency->price = $request->price;
            $currency->save();

            if(!$currency){
                throw new Exception('Currency cannot be updated.', 400);
            }

            $return = response()->json($currency);
        }
        catch (Exception $exception) {
            $return = response()->json([
                'error' => ExceptionHelper::catchExceptionMessage($exception)
            ], ExceptionHelper::catchExceptionCode($exception));
        }

        return $return;
    }

    /**
     * Delete Currency.
     * @param Request $request
     * @param int id
     *
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function deleteCurrency(Request $request, int $id): JsonResponse
    {
        try {
            $currency = (new CurrencyService())->getCurrencyIfExists($id);
            $currency->delete();

            $return = response()->json([], 204);
        } catch (Exception $exception) {
            $return = response()->json([
                'error' => ExceptionHelper::catchExceptionMessage($exception)
            ], ExceptionHelper::catchExceptionCode($exception));
        }

       return $return;
    }



}
