<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\TryCatch;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->guard = "api"; // add
    }

    public function register(Request $request)
    {
        $firstName = $request->firstName;
        $lastName = $request->lastName;
        $email = $request->email;
        $password = $request->password;

        // Check if field is empty
        if (empty($firstName) or empty($lastName) or empty($email) or empty($password)) {
            return response()->json(['status' => 'error', 'message' => 'Você deve preencher todos os campos']);
        }

        // Check if email is valid
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['status' => 'error', 'message' => 'Você deve inserir um e-mail válido']);
        }

        // Check if password is greater than 5 character
        if (strlen($password) < 6) {
            return response()->json(['status' => 'error', 'message' => 'A senha deve ter no mínimo 6 caracteres']);
        }

        // Check if user already exist
        if (Users::where('email', '=', $email)->exists()) {
            return response()->json(['status' => 'error', 'message' => 'Existe um usuário com este e-mail']);
        }

        // Create new user
        try {
            $user = new Users();
            $user->firstName = $request->firstName;
            $user->lastName = $request->lastName;
            $user->email = $request->email;
            $user->password = app('hash')->make($request->password);

            if ($user->save()) {
                return $this->login($request);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Desconectado com sucesso!']);
    }

    public function login(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
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

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email e Password errados',
                ], 401);
            }


            //        dd(app('hash')->make($request->password));
            $user = User::where([
                'email' => $request->email
            ])->first();

            return response()->json([
                'status' => true,
                'message' => 'Acesso liberado',
                'token' =>  $user->createToken("API TOKEN")->plainTextToken
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'status' => false,
                'message' => $ex->getMessage()
            ], 500);
        }
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
