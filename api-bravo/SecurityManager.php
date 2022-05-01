<?php

class SecurityManager {

  static function clearInput($input) {

    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);

    return $input;
  }

}

?>
