<?php

namespace App\Http\Controllers;

use App\Services\ConverterService;
use Illuminate\Http\Request;

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

            $response = $this->converterService->getConversionWith($from, $to, $amount);

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response("", 400);
        }

    }
}