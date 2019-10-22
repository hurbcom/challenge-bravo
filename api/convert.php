<?php


$from = $_POST['from'];

$to = $_POST['to'];

$amount = $_POST['amount'];



if($from == 'BTC'||$from == 'ETH'||$to == 'BTC'||$to == 'ETH'){
    
    $content = file_get_contents("https://min-api.cryptocompare.com/data/price?fsym=$from&tsyms=$to");
    $vars = json_decode($content, true);
    
   
    $finalResult = $vars[$to];
    
}else{


$content = file_get_contents("https://api.exchangeratesapi.io/latest?base=$from");//API que retorna os valores atualizados de cambio, estou enviando a variavel FROM como parametro

$vars = json_decode($content, true);

$toCalc = $vars["rates"][$to];


$finalResult = calcEx($amount, $toCalc);


}





function calcEx($amount, $to){
    
    $result = $amount * $to; //calculo para obter o valor final, valor requerido para conversao * o rate de conversao obtido pela API existente.

    
    return $result;
}

echo json_encode($finalResult);
//echo json_encode(number_format($finalResult, 2, '.', ''));//retornando o valor final calculado

?>