<?php

require __DIR__ . '/../bootstrap.php';

$request = new Src\Request;
$router->resolve($request);
//echo $request->uri();

//$url = $_SERVER['REQUEST_URI'];
//echo $url;