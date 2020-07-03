<?php

namespace App\Api;

class ApiMessages
{
    private $message = [];

    public function __construct(string $message, array $data = [])
    {
        $this->message["message"] = $message;
        $this->message["erros"] = $data;
    }

    public function getMessage()
    {
        return $this->message;
    }
}