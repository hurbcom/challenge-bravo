<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    private $user;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Display a listing of the users
     *
     * @param  \App\Models\User  $model
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $users = $this->user->paginate(10);

        return view('users.index', [
            'users' => $users
        ]);
    }

    /** 
     * Lista usuários via API
     */
    public function list()
    {
        return $this->user->paginate(10);
    }

    /** 
     * Lista um usuário via API
     */
    public function show($id)
    {
        $user = $this->user->find($id);

        if ($user) {
            return response()->json([
                'status' => true,
                'message' => 'Usúario encontrado!',
                'data' => $user
            ], 202);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Usuário não encontrado',
            ], 404);
        }
    }

    /** 
     * Cadastra usuário via API
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|string',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validator->errors()
                ], 401);
            }

            $this->user->create($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Usuário cadastro com sucesso!!!',
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function update($id, Request $request)
    {
        $user = $this->user->find($id);
        $user->update($request->all());
        $user->save();

        if ($user) {
            return response()->json([
                'status' => true,
                'message' => 'Usuário atualizado com sucesso!',
            ], 200);
        }
    }

    public function destroy($user_id)
    {
        $user = $this->user->find($user_id);
        if ($user) {
            $user->delete();

            return response()
                ->json([
                    'data' => $user,
                    'message' => 'Usuário foi removido com sucesso!',
                    "status" => true
                ], 200);
        } else {
            return response()
                ->json([
                    'data' => $user,
                    'message' => 'Usuário não encontrado',
                    "status" => false
                ], 404);
        }
    }
}
