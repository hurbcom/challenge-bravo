<?php
//Pegando as informações de valores em uma API externa.
$ch = curl_init("https://apilayer.net/api/live?access_key=14bbeef05c6df6ad67818332a47960b3&currencies=USD,BRL,EUR,BTC,ETH&format=1");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$json = curl_exec($ch);
curl_close($ch);
//Abrindo um arquivo para salvar os dados para serem reultilizados
$file = fopen('moedas.txt', 'w');
fwrite($file, $json);
fclose($file);

?>
