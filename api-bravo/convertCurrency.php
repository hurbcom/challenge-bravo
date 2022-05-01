<?php

  require_once('SecurityManager.php');
  require_once('CurrencyManager.php');

  header("Content-Type: application/json; charset=UTF-8");

  // formato da resposta da API
  $response = array(
    "error" => '',
    "from"=> $_GET['from'] ?? '',
    "to"=> $_GET['to'] ?? '',
    "amount"=> $_GET['amount'] ?? '',
    "result"=> '',
    "msg"=> '',
    "query-timestamp"=> date("Y-m-d G:i:s")
  );

  if($_SERVER["REQUEST_METHOD"] != 'GET'){
    $response['error'] = true;
    $response['msg'] = "Método HTTP inválido";

    die(json_encode($response, JSON_UNESCAPED_UNICODE));
  }

  // Verifica se os parâmetros foram informados e efetua uma prevenção de segurança básica dos valores inseridos
  if(isset($_GET['from']) && !empty($_GET['from'])){

    $from = SecurityManager::clearInput($_GET['from']);

  }else{

    $response['error'] = true;
    $response['msg'] = "Parâmetro FROM incorreto ou não informado";

    die(json_encode($response, JSON_UNESCAPED_UNICODE));

  }

  if(isset($_GET['to']) && !empty($_GET['to'])){

    $to = SecurityManager::clearInput($_GET['to']);

  }else{

    $response['error'] = true;
    $response['msg'] = "Parâmetro TO incorreto ou não informado";

    die(json_encode($response, JSON_UNESCAPED_UNICODE));

  }

  if(isset($_GET['amount']) && is_numeric($_GET['amount'])){

    $amount = SecurityManager::clearInput($_GET['amount']);

  }else{

    $response['error'] = true;
    $response['msg'] = gettype($float). " Parâmetro AMOUNT incorreto ou não informado";

    die(json_encode($response, JSON_UNESCAPED_UNICODE));

  }

  // Caso os parâmetros estejam OK, instanciar o gerenciador de moedas
  $mng = new CurrencyManager();

  // Chama método do gerenciador responsável por efetuar a conversão
  $mngMsg = $mng->convertCurrency($from, $to, $amount);

  // atribui a resposta do gerenciador à resposta do endpoint
  $response['error'] = $mngMsg['error'];
  $response['result'] = $mngMsg['result'];
  $response['msg'] = $mngMsg['msg'];

  die(json_encode($response, JSON_UNESCAPED_UNICODE));


 ?>
