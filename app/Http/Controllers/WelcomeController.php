<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Laravel\Lumen\Application;

class WelcomeController extends Controller
{
    public function index(Application $application): JsonResponse
    {
        return response()->json([
            'framework' => $application->version(),
            'app' => 'Hurb Challenge Bravo'
        ]);
    }
}
