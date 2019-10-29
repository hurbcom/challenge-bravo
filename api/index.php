<?php
include("class/api.php");


$method = $_SERVER["REQUEST_METHOD"];
$api = new API($method);
$api->process_request();
