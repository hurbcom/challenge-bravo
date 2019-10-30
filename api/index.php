<?php
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);


define("DB_HOST", "127.0.0.1:4706");
define("DB_USER", "root");
define("DB_PASS", "squeal");
define("DB_NAME", "bravo");

include("class/api.php");
include("class/HTTPCurrency.php");
include("class/Currency.php");
include("class/DbPDO.class.php");

$method = $_SERVER["REQUEST_METHOD"];
$api = new API($method);
$api->process_request();
