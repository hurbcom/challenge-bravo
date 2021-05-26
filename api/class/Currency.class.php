<?php

require_once __DIR__ . "/ExceptionApi.class.php";
require_once __DIR__ . "/Data.class.php";

class Currency extends Data
{
    private $name;
    private $amount;
    private $index = false;

    function __construct($request = [])
    {
        $this->set($request);
        parent::__construct($request);
    }

    public function get()
    {
        return [
            "name" => $this->name,
            "amount" => $this->amount
        ];
    }

    public function set($data)
    {
        if ($data && is_array($data)) {
            foreach ($data as $key => $value) {
                if (method_exists($this, "set" . ucfirst($key))) {
                    $this->{"set" . ucfirst($key)}($value);
                }
            }
        }
    }

    public function getName()
    {
        return $this->name;
    }

    public function getAmount()
    {
        return $this->amount;
    }

    public function getIndex()
    {
        return $this->amount;
    }

    public function setName($name)
    {
        return $this->name = urldecode($name);
    }

    public function setAmount($amount)
    {
        return $this->amount = urldecode($amount);
    }

    public function validateName()
    {
        if (!$this->name) {
            throw new ExceptionApi('O atributo name é obrigatório.', 400);
        }
    }

    public function validateDuplicateName()
    {
        if ($this->findIndexByName($this->name) !== false) {
            throw new ExceptionApi($this->name . ' já existe.', 400);
        }
    }

    public function validateAmount()
    {
        if (!is_numeric($this->amount) || $this->amount <= 0) {
            throw new ExceptionApi('O atributo amount é obrigatório e deve conter um valor numérico maior que zero.', 400);
        }
    }

    public function findIndexByName($name)
    {
        $index = false;
        foreach ($this->dataJson as $k => $v) {
            if ($v['name'] == $name) {
                $index = $k;
                break;
            }
        }
        return $this->index = $index;
    }

    public function getCurrency($name, $newInstance = false)
    {
        $index = $this->findIndexByName($name);
        if ($index === false) {
            throw new ExceptionApi('Moeda ' . $name . ' não encontrada.', 400);
        }
        if (!$newInstance) {
            $this->set($this->dataJson[$index]);
        } else {
            return new self($this->dataJson[$index]);
        }
    }

    public function convertTo($name, $amount = 1)
    {
		$toCurrency = $this->getCurrency($name, true);
        return floatval(($this->getAmount() / $toCurrency->getAmount()) * $amount);
    }

    public function remove()
    {
        if ($this->index === false) {
            $this->getCurrency($this->name);
        }
        $this->removeJsonFile($this->index);
    }

    public function save($validate = true)
    {
        if ($validate) {
            $this->validateName();
            $this->validateDuplicateName();
            $this->validateAmount();
        }
        $this->appendJsonFile($this->get());
    }
}
