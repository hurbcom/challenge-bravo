<?php

  header("Content-Type: application/json; charset=UTF-8");

  // obtém o método HTTP
  $requestMethod = $_SERVER["REQUEST_METHOD"];

  // retorna esta mensagem, caso nenhum método HTTP apropriado seja chamado
  $response = array(
    "error" => true,
    "msg" => "Método HTTP inválido"
  );

  $curl = curl_init();

  curl_setopt_array($curl, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => 'GET',
  ]);

  switch ($requestMethod) {
    case 'POST':

      $code = $_POST['code'] ?? '';
      $name = $_POST['name'] ?? '';
      $rate = $_POST['rate'] ?? '';

      curl_setopt($curl, CURLOPT_URL,
        'http://localhost:8088/addCurrency.php?code='.$code.'&name='.$name.'&rate='.$rate);

      $response = curl_exec($curl);
      curl_close($curl);

      die($response);

      break;

    case 'PUT':

      parse_str(file_get_contents('php://input'), $_PUT);

      // atribui as seguintes posições do vetor às respectivas variáveis, caso haja algo na posição informada
      $code = $_PUT['code'] ?? '';
      $rate = $_PUT['rate'] ?? '';

      curl_setopt($curl, CURLOPT_URL,
        'http://localhost:8088/updateCurrency.php?code='.$code.'&rate='.$rate);

      $response = curl_exec($curl);
      curl_close($curl);

      die($response);

      break;

    case 'DELETE':

      parse_str(file_get_contents('php://input'), $_DELETE);

      $code = $_DELETE['code'] ?? '';

      curl_setopt($curl, CURLOPT_URL,
        'http://localhost:8088/removeCurrency.php?code='.$code);

      $response = curl_exec($curl);
      curl_close($curl);

      die($response);

      break;

    default:
      // caso não haja compatibilidade das requisições HTTP
      die(json_encode($response, JSON_UNESCAPED_UNICODE));
      break;

  }

?>
