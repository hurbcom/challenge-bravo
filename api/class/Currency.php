<?php

class Currency {

    private $code;
    private $name;
    private $is_crypto;

    function get($code)
    {
        $sql = "SELECT * FROM currency WHERE code = :code";
        $pdo = new DbPDO();
        $pdo->query($sql);
        $pdo->bind(':code', $code);
        return $pdo->single();
    }

}
