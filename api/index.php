<?php
// class with the conversion functions
include("../src/Classes/currency.php");
$conversionFunctions = new currencyClass();

// declaration of initial variables 
$from = strtolower($_GET['from']);
$to = strtolower($_GET['to']);
$amount = $_GET['amount'];

// all conversion will be based on the dollar value
$rates = array('USD'=> 1);

// generate value of the currencies having the dollar as ballast
$conversionFunctions->getRegularRates($rates);
$conversionFunctions->getCryptoRates($from,$to,$rates);

// get currency values based on conversions
$fromRate = $conversionFunctions->getCurrencyRate($from,$rates,1);
$toRate = $conversionFunctions->getCurrencyRate($to,$rates,$amount);

$converted = bcdiv($toRate,$fromRate,6);
$value = number_format($converted, 6, '.', '');
$amount = number_format($amount, 2, '.', '');

// preparing the json to be delivered
$result = array(
    "from" => $from,
    "to" => $to,
    "from_symbol" => $conversionFunctions->getCurrencySymbol($from),
    "from_value" => $amount,
    "to_symbol" => $conversionFunctions->getCurrencySymbol($to),
    "to_value" => $value,
    "timestamp" => "1",
    "msg" => "OK"
);

echo json_encode($result);

?>