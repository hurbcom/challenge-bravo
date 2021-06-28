<?php

namespace Src;


class Request
{

    protected $files;
    protected $base;
    protected $uri;
    protected $method;
    protected $protocol;
    protected $data = [];

    public function __construct()
    {
        $this->base = $_SERVER['HTTP_HOST'];
        list($uri, $getParams) = explode('?', $_SERVER['REQUEST_URI']);
        $this->uri = $uri;
        $this->method = strtolower($_SERVER['REQUEST_METHOD']);
        $this->protocol = (isset($_SERVER["HTTPS"]) || $_SERVER['HTTP_X_FORWARDED_PROTO']) ? 'https' : 'http';
        $this->setData();

        if(count($_FILES) > 0) {
            $this->setFiles();
        }

    }

    protected function setData()
    {
        switch($this->method)
        {
            case 'post':
                $this->data = array_merge($_POST, json_decode(file_get_contents('php://input', true), true));
                break;
            case 'get':
                $this->data = $_GET;
                break;
            case 'head':
            case 'put':
                $this->data = array_merge($_POST, json_decode(file_get_contents('php://input', true), true));
                break;
            case 'delete':
            case 'options':
                parse_str(file_get_contents('php://input', true), $this->data);
        }
    }

    protected function sefFiles() {
        foreach ($_FILES as $key => $value) {
            $this->files[$key] = $value;
        }
    }

    public function base()
    {
        return $this->base;
    }

    public function uri(){
        return $this->uri;
    }

    public function method(){

        return $this->method;
    }

    public function all($fields = [])
    {
        if (empty($fields)) {
            return $this->data;
        }

        $returnedData = [];
        foreach ($fields as $field) {
            if (!$this->data[$field]) {
                continue;
            }
            $returnedData[$field] = $this->data[$field];
        }
        return $returnedData;
    }

    public function __isset($key)
    {
        return isset($this->data[$key]);
    }

    public function __get($key)
    {
        if(isset($this->data[$key]))
        {
            return $this->data[$key];
        }
    }

    public function hasFile($key) {

        return isset($this->files[$key]);
    }

    public function file($key){

        if(isset($this->files[$key]))
        {
            return $this->files[$key];
        }
    }
}