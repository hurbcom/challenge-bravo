<?php

  require_once('SecurityManager.php');
  require_once('CurrencyManager.php');

  header("Content-Type: application/json; charset=UTF-8");

  // formato da resposta da API
  $response = array(
    "error" => '',
    "code"=> $_GET['code'] ?? '',
    "name"=> $_GET['name'] ?? '',
    "rate"=> $_GET['rate'] ?? '',
    "msg"=> '',
    "query-timestamp"=> date("Y-m-d G:i:s")
  );

  if($_SERVER["REQUEST_METHOD"] != 'GET'){
    $response['error'] = true;
    $response['msg'] = "Método HTTP inválido";

    die(json_encode($response, JSON_UNESCAPED_UNICODE));
  }

  // Verifica se os parâmetros foram informados e efetua uma prevenção de segurança básica dos valores inseridos
  if(isset($_GET['code']) && !empty($_GET['code'])){

    $code = SecurityManager::clearInput($_GET['code']);

  }else{

    $response['error'] = true;
    $response['msg'] = "Parâmetro CODE não informado";

    die(json_encode($response, JSON_UNESCAPED_UNICODE));

  }

  if(isset($_GET['name']) && !empty($_GET['name'])){

    $name = SecurityManager::clearInput($_GET['name']);

  }else{

    $response['error'] = true;
    $response['msg'] = "Parâmetro NAME não informado";

    die(json_encode($response, JSON_UNESCAPED_UNICODE));

  }

  if(isset($_GET['rate']) && !empty($_GET['rate'])){

    $rate = SecurityManager::clearInput($_GET['rate']);

  }else{

    $response['error'] = true;
    $response['msg'] = "Parâmetro RATE não informado";

    die(json_encode($response, JSON_UNESCAPED_UNICODE));

  }

  // Caso os parâmetros estejam OK, instanciar o gerenciador de moedas
  $mng = new CurrencyManager();

  // Chama método do gerenciador responsável por efetuar a conversão
  $mngMsg = $mng->addCurrency($code, $name, $rate);

  // atribui a resposta do gerenciador à resposta do endpoint
  $response['error'] = $mngMsg['error'];
  $response['msg'] = $mngMsg['msg'];

  die(json_encode($response, JSON_UNESCAPED_UNICODE));


 ?>
