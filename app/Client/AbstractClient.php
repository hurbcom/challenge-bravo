<?php
namespace App\Client;

use Exception;
use Log;

abstract class AbstractClient
{
    protected $apiClient;

    abstract protected function getUrl() : string;

    abstract protected function getToken() : string;

    public function __construct()
    {
        $this->apiClient = new APIClient();
    }

    public function setAPIClient(APIClient $apiClient)
    {
        $this->apiClient = $apiClient;
    }

    protected function query($url)
    {
        try {
            return $this->apiClient->json(
                $url,
                [
                    'Content-type: application/json',
                ]
            );
        } catch (Exception $exception) {
            Log::error(
                $exception->getMessage(),
                [
                    'url' => $url,
                ]
            );
            throw $exception;
        }
    }

}