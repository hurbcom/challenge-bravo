<?php
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);

include("config.php");
include("class/api.php");
include("class/HTTPCurrency.php");
include("class/Currency.php");
include("class/DbPDO.class.php");

$method = $_SERVER["REQUEST_METHOD"];
$api = new API();
echo $api->process_request($method);
