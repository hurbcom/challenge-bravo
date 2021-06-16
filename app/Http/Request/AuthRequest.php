<?php
namespace App\Http\Request;

use Exception;
use Illuminate\Http\Request;

class AuthRequest
{
    private $request;
    public function __construct(Request $request)
    {
        $this->request = $request;
    }
    public function getCredentials()
    {
        $credentials = $this->request->only(['email', 'password']);
        if(empty($credentials["email"]) || empty($credentials["password"])){
            throw new Exception("Algum informação para autenticaçao nao foi informada.", 400);
        }
        return $credentials;
    }
}
