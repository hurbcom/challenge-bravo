<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Request\AuthRequest;
use App\Services\AuthService;
use Exception;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(AuthRequest $request)
    {
        try {
            $credentials = $request->getCredentials();
            $token = $this->authService->getToken($credentials);
            return $this->authService->respondWithToken($token);
        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage(),
            ], $e->getCode());
        }
    }

    
}