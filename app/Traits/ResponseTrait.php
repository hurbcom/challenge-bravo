<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ResponseTrait
{
    /**
     * Gerando resposta em caso de sucesso 
     * Retorne os dados de sucesso e mensagem se tiver algum erro
     *
     * @param object $data
     * @param string $message
     * @param integer $status_code
     * @return JsonResponse
     */
    public function responseSuccess($data, $message = "Sucesso", $status_code = JsonResponse::HTTP_OK): JsonResponse
    {
        return response()->json([
            'status'  => true,
            'message' => $message,
            'errors'  => null,
            'data'    => $data,
        ], $status_code);
    }

    /**
     * Gerando erro de resposta.
     *
     * Retorne os dados de erro
     *
     * @param object $errors
     * @return JsonResponse
     */
    public function responseError($errors, $message = 'Dados invalidos', $status_code = JsonResponse::HTTP_BAD_REQUEST): JsonResponse
    {
        return response()->json([
            'status'  => false,
            'message' => $message,
            'errors'  => $errors,
            'data'    => null,
        ], $status_code);
    }
}
