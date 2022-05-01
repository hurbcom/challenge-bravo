<?php
  declare(strict_types=1);

  class Currency {

    private $id;
    private $code;
    private $name;
    private $rate; // cotação em relação ao USD.
    private $src; // para saber se a moeda é da API externa ou da própria API.
    private $lastUpdate; // última atualização - variável usada para determinar a necessidade de consumo da API externa


    function getId(){
      return $this->id;
    }

    function setId(int $id){
      $this->id = $id;
    }

    function getCode(){
      return $this->code;
    }

    function setCode(string $code){
      $this->code = $code;
    }

    function getName(){
      return $this->name;
    }

    function setName(string $name){
      $this->name = $name;
    }

    function getRate(){
      return $this->rate;
    }

    function setRate(Float $rate){
      $this->rate = $rate;
    }

    function getSrc(){
      return $this->src;
    }

    function setSrc(string $src){
      $this->src = $src;
    }

    function getLastUpdate(){
      return $this->lastUpdate;
    }

    function setLastUpdate(int $lastUpdate){
      $this->lastUpdate = $lastUpdate;
    }

  }

 ?>
