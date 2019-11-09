<?php

namespace App\Core\HttpClient;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;

abstract class Response extends JsonResponse
{
    /**
     * @return string
     */
    abstract public function getErrorMessage(): string;

    /**
     * @return string
     */
    abstract public function getErrorCode(): string;

    /**
     * @param bool $assoc
     * @param int $depth
     * @return mixed
     */
    public function getData($assoc = true, $depth = 512)
    {
        return parent::getData($assoc, $depth);
    }

    /**
     * @param string $key
     * @param null $default
     * @return mixed
     */
    public function getFieldData(string $key, $default = null)
    {
        return Arr::get($this->getData(), $key, $default);
    }
}