<?php

  require_once('CurrencyManager.php');

  $mng = new CurrencyManager();

  set_error_handler(function ($err_severity, $err_msg, $err_file, $err_line, array $err_context)
  {
    throw new ErrorException( $err_msg, 0, $err_severity, $err_file, $err_line );
  }, E_WARNING);

  try {
    $mng->populateDB();
    echo "API carregada com sucesso!";

  } catch (Exception $ex) {
    echo "A API Challenge-Bravo não foi carregada. Verifique se a chave da API externa foi inserida no arquivo apiKey.txt.";
  }

  restore_error_handler();


?>
