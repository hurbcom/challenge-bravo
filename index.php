<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require './vendor/autoload.php';
require './class/converter.php';
$app = new \Slim\Slim();

//defina a rota
$app->get('/', function () use ($app){
  // tenta realizar a operação
  try {
    // parametros passados na url do GET
    $from = $app->request()->params('from');
    $to = $app->request()->params('to');
  
    // instancia a classe de conversão
    $conversor = new Conversor();

    // valida se as moedas passadas no parâmetro estão dentro das permitidas
    $fromExist = $conversor->validaMoeda($from);
    $toExist = $conversor->validaMoeda($to);

    // caso não estejam, retorna uma mensagem de erro
    if ($fromExist == false && $toExist == false) {
      echo json_encode(array('errorMessage' => "The value send on \"From\" and \"To\" parameter is not valid"));
    } else if ($toExist == false) {
      echo json_encode(array('errorMessage' => "The value send on \"To\" parameter is not valid"));
    } else if ($fromExist == false) {
      echo json_encode(array('errorMessage' => "The value send on \"From\" parameter is not valid"));
    }

    // valida se o valor passado no parametro para conversão é realmente um número
    $value = is_numeric ($app->request()->params('amount')) ? $app->request()->params('amount') : false;
    
    if (!$value) {
      // caso não for, retorna um erro
      echo json_encode(array('errorMessage' => "The value send on \"amount\" parameter is not valid"));
    } else {
      // caso for, setamos uma propriedade privada do conversor que terá o valor
      $conversor->setValue($value);
    }

    if ($to == "BRL") {
      // caso for uma conversão direta pra real, chamamops somente um método
      $finalValue = $conversor->converter2Real($from);
    } else {
      // caso não for, passamos pra real e depois para a moeda solicitada
      $valueInReal = $conversor->converter2Real($from);
      $finalValue = $conversor->converterReal2To($to, $valueInReal);
    }

    // caso tudo certo, retorna o valor com o símbolo da moeda e já no formato certo da moeda
    echo json_encode(array('convertedValue' => $conversor->addMoneySymbol($finalValue, $to)));

  } catch (Exception $e) {
    // caso não consiga, retorna um erro
    echo json_encode(array('exception' => $e->getMessage()));
  }

  }); 

$app->run();
