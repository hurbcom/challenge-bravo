<?php
// class with the conversion functions
include("../src/classes/currency.php");
$conversionFunctions = new currencyClass();

// declaration of initial variables 
$from = strtolower($_GET['from']);
$to = strtolower($_GET['to']);
$amount = $_GET['amount'];

if (!in_array($from,array('usd','brl','eur','btc','eth')) || !in_array($to,array('usd','brl','eur','btc','eth'))) {
    $result = array(
        "error" => "one of the currencies is not available for conversion",
        "msg" => "bad request",
        "status" => 400
    );
    echo json_encode($result); return;
}

if (!is_numeric($amount)) {
    $result = array(
        "error" => "the amount format must be numeric with periods separating the decimals",
        "msg" => "bad request",
        "status" => 400
    );
    echo json_encode($result); return;
}

// all conversion will be based on the dollar value
$rates = array('USD'=> 1);

// generate value of the currencies having the dollar as ballast
$conversionFunctions->getRegularRates($rates);
$conversionFunctions->getCryptoRates($from,$to,$rates);

// get currency values based on conversions
$fromRate = $conversionFunctions->getCurrencyRate($from,$rates,1);
$toRate = $conversionFunctions->getCurrencyRate($to,$rates,$amount);

if ($fromRate == 0 || $toRate == 0) {
    $result = array(
        "error" => "API url can not be reached",
        "msg" => "not found",
        "status" => 404
    );
    echo json_encode($result); return;
}

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
    "timestamp" => time(),
    "msg" => "OK",
    "status" => 200
);

echo json_encode($result);

?>