<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require __DIR__ . '/../bootstrap.php';

$request = new Src\Request;
$router->resolve($request);
//echo $request->uri();

//$url = $_SERVER['REQUEST_URI'];
//echo $url;