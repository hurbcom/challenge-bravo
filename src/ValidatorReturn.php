<?php

namespace Src;

class ValidatorReturn {

    private $errors;

    public function __construct($errors)
    {
        $this->errors = $errors;
    }

    public function fails()
    {
        return !empty($this->errors);
    }

    public function getErrors()
    {
        return $this->errors;
    }
}