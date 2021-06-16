<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\QuotationService;
use Exception;
use Illuminate\Http\Request;

class ConversionController extends Controller
{
    protected $quotationService;

    public function __construct(QuotationService $quotationService)
    {
        $this->quotationService = $quotationService;
    }

    public function conversion(Request $request)
    {
        try {
            $data = $request->all();
            $result = $this->quotationService->conversion($data["from"], $data["to"], $data["amount"]);
            return response()->json([
                "from" => $data["from"],
                "to" => $data["to"],
                "amount" => $data["amount"],
                "result" => $result,
                "message" => "Conversão concluída com sucesso",
            ]);
        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage(),
            ], 400);
        }
    }

    public function refreshReferences()
    {
        $this->quotationService->refresh();
    } 

    
}