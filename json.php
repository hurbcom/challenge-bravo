<?php
//Recebendo os parametros via method get
$MoedaFrom = $_GET['from'];
$MoedaTo = $_GET['to'];
$Valor = $_GET['amount'];
//Lendo o arquivo que foi salvo pelo job
$json = file_get_contents("moedas.txt");
$conversionResult = json_decode($json, true);
//Filtrando os valores do json
$Moedas = $conversionResult['quotes'];
//Realizando o calculo da conversão da moeda
$total = number_format($Valor*($Moedas['USD'.$MoedaTo]/$Moedas['USD'.$MoedaFrom]),2);
$array = array('resultado'=>$total);
echo json_encode($array);
?>
