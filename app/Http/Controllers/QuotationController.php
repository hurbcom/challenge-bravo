<?php

namespace App\Http\Controllers;

use Exception;

use Illuminate\Http\Request;
use App\Repository\QuotationRepository;


class QuotationController extends Controller
{
    protected QuotationRepository $repository;
   
    public function __construct(QuotationRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $rows = $this->repository->all();
            return response()->json($rows);
        } catch (Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => $e->getMessage(),
            ],400);
        }
    }

    public function show($id)
    {
        try {
            $row =  $this->repository->find($id);
            return response()->json($row);
        } catch (Exception $e) {
            return response()->json([
                        "status" => "error",
                        "message" => $e->getMessage(),
                    ],400);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            $row = $this->repository->create($data);
            return response()->json($row);
        } catch (Exception $e) {
            return response()->json([
                        "status" => "error",
                        "message" => $e->getMessage(),
                    ],400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            $row = $this->repository->update($data, $id);
            return response()->json($row);
        } catch (Exception $e) {
            return response()->json([
                        "status" => "error",
                        "message" => $e->getMessage(),
                    ],400);
        }
    }

    public function destroy($id)
    {
        try {
            $usina = $this->repository->destroy($id);
            return response()->json(['mensagem' => 'Quotation deleted.']);
        } catch (Exception $e) {
            return response()->json([
                        "status" => "error",
                        "message" => $e->getMessage(),
                    ],400);
        }
    }

}
