<?php

namespace App\Core\HttpClient;

use GuzzleHttp\RequestOptions;

abstract class Request
{
    private $options = [
        RequestOptions::HTTP_ERRORS => false
    ];

    /**
     * @return string
     */
    abstract public function path(): string;

    /**
     * @return array
     */
    abstract protected function body(): array;

    /**
     * @return string
     */
    abstract public function method(): string;

    /**
     * @return string
     */
    abstract public function responseClass(): string;

    /**
     * @param array $headers
     */
    public function headers(array $headers = []): void
    {
        $this->options[RequestOptions::HEADERS] = array_merge(
            $headers,
            $this->options[RequestOptions::HEADERS] ?? []
        );
    }

    /**
     * @return array
     */
    protected function fullBody(): array
    {
        return array_merge($this->defaultBody(), $this->body());
    }

    /**
     * @return array
     */
    public function options(): array
    {
        $body = $this->fullBody();
        if (count($body) > 0) {
            $this->options[RequestOptions::JSON] = $body;
            $this->options[RequestOptions::DECODE_CONTENT] = 'json';
        }
        $this->headers();
        return $this->options;
    }

    /**
     * @return array
     */
    protected function defaultBody(): array
    {
        return [];
    }

    /**
     * @return string
     */
    public function fullPath(): string
    {
        return sprintf("%s%s", $this->basePath(), $this->path());
    }

    /**
     * @return string
     */
    protected function basePath(): string
    {
        return "";
    }

    /**
     * @return bool
     */
    public function cached(): bool
    {
        return true;
    }
}