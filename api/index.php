<?php

try {

	require_once __DIR__ . '/class/Api.class.php';
	require_once __DIR__ . "/class/ExceptionApi.class.php";

	$requestMethod = $_SERVER['REQUEST_METHOD'];
	switch ($requestMethod) {
		case 'POST':
			$method = "addCurrency";
			break;

		case 'GET':
			$method = "convertCurrency";
			break;

		case 'DELETE':
			$method = "removeCurrency";
			break;

		default:
			$method = "";
			break;
	}

	if (!$method) {
		throw new ExceptionApi("O método $requestMethod não foi implementado.", 405);
	}

	new Api($method);

} catch (\Throwable $th) {
	http_response_code($th->getCode() ?: 400);
	echo json_encode(["message" => $th->getMessage() ?: "Não foi possível realizar a operação."]);
}
