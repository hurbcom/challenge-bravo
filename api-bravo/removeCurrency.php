<?php

  require_once('SecurityManager.php');
  require_once('CurrencyManager.php');

  header("Content-Type: application/json; charset=UTF-8");

  // formato da resposta da API
  $response = array(
    "error" => '',
    "code"=> $_GET['code'] ?? '',
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

  // Caso os parâmetros estejam OK, instanciar o gerenciador de moedas
  $mng = new CurrencyManager();

  // Chama método do gerenciador responsável por efetuar a conversão
  $mngMsg = $mng->removeCurrency($code);

  // atribui a resposta do gerenciador à resposta do endpoint
  $response['error'] = $mngMsg['error'];
  $response['msg'] = $mngMsg['msg'];

  die(json_encode($response, JSON_UNESCAPED_UNICODE));


 ?>
