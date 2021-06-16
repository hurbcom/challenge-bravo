<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Auth;

class AuthService extends Auth
{
    

    public function respondWithToken(String $token)
    {
        return response()->json([
            'user' => auth()->user(),
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ]);
    }

    public function getToken(Array $credentials)
    {
        
        $return = Auth::attempt($credentials);
        if (!$return) {
            throw new Exception("usuario nao autorizado", 401);
        }

        return $return;
    }
}
