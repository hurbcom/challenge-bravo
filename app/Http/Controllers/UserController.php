<?php

namespace App\Http\Controllers;

use Exception;

use Illuminate\Http\Request;
use App\Repository\UserRepository;


class UserController extends Controller
{
    protected UserRepository $repository;
   
    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $rows = $this->repository->all();
            return response()->json($rows);
        } catch (Exception $e) {
            return $this->exceptionHandler($e);
        }
    }

    public function show($id)
    {
        try {
            $row =  $this->repository->find($id);
            return response()->json($row);
        } catch (Exception $e) {
            return $this->exceptionHandler($e);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            $row = $this->repository->create($data);
            return response()->json($row);
        } catch (Exception $e) {
            return $this->exceptionHandler($e);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            $row = $this->repository->update($data, $id);
            return response()->json($row);
        } catch (Exception $e) {
            return $this->exceptionHandler($e);
        }
    }

    public function destroy($id)
    {
        try {
            $usina = $this->repository->destroy($id);
            return response()->json(['mensagem' => 'Usina inatvada com sucesso.']);
        } catch (Exception $e) {
            return $this->exceptionHandler($e);
        }
    }

    protected function exceptionHandler(Exception $e)
    {
        return response()->json(['mensagem' => $e->getMessage()], 400);
    }

}
