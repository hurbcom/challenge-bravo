<?php

require_once __DIR__ . "/ExceptionApi.class.php";

class Data
{
    protected $dataJsonFile = __DIR__ . '/../data/data.json';
    protected $dataJson;

    function __construct($request)
    {
        $this->dataJson = json_decode(file_get_contents($this->dataJsonFile), true) ?: [];
    }

    protected function appendJsonFile($data, $save = true)
    {
        array_push($this->dataJson, $data);
        if ($save) {
            $this->saveJsonFile();
        }
    }

    protected function removeJsonFile($index, $save = true)
    {
        unset($this->dataJson[$index]);
        if ($save) {
            $this->saveJsonFile();
        }
    }

    protected function saveJsonFile()
    {
        return file_put_contents($this->dataJsonFile, json_encode($this->dataJson));
    }
}
