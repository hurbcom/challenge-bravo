<?php

namespace App\Http\Controllers;

use App\Services\ConverterService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Repositories\RateRepository;

class QuotationController extends Controller
{
    private $converterService;

    public function __construct(ConverterService $converterService)
    {
        $this->converterService = $converterService;
    }

    public function convert(Request $request) {
        try {
            $from = $request->input('from');
            $to = $request->input('to');
            $amount = (float)$request->input('amount');

            $this->validate($request, [
                'from' => 'required',
                'to' => 'required',
                'amount' => 'required',
            ]);

            $convertedAmount = $this->converterService->getConversionWith($from, $to, $amount);

            $response = [
                'from' => $from,
                'to' => $to,
                'amount' => $amount,
                'converted_amount' => $convertedAmount
            ];

            return response()->json($response, 200);
        } catch (ValidationException $e) {
            return response('', 400);
        } catch (\Exception $e) {
            return response('', 500);
        }

    }

    public function renewCache(Request $request, RateRepository $rateRepository) {

        try {
            $code = $request->input('code');


            $this->validate($request, [
                'code' => 'required'
            ]);

            $rateRepository->getBallastRateFor($code);

            return response('', 200);
        } catch (ValidationException $e) {
            return response('', 400);
        } catch (\Exception $e) {
            return response('', 500);
        }
    }
}