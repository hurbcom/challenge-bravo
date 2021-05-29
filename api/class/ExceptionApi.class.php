<?php

class ExceptionApi extends \Exception
{
    private $dataJsonFile = __DIR__ . '/../data/exception.log';

    function __construct($message = "", $code = 0, ?Throwable $previous = null)
    {
        $data = date('d/m/Y H:i:s') . " ------------------------------------------------ \n";
        $data .= $this->getFile() . ' -> ' . $message . "\n";
        $data .= json_encode($this->getTrace(), true) . "\n\n";
        $data .= file_get_contents($this->dataJsonFile);

        file_put_contents($this->dataJsonFile, $data);
        parent::__construct($message, $code, $previous);
    }
}
