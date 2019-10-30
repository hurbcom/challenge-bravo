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

    function create($code, $name, $is_crypto)
    {

        $pdo = new DbPDO();
        $sql = "INSERT INTO currency (code, name, is_crypto) VALUES (:code, :name, :is_crypto)";
        $pdo->query($sql);
        $pdo->bind(':code', $code);
        $pdo->bind(':name', $name);
        $pdo->bind(':is_crypto', $is_crypto);

        try
        {
            $pdo->execute();
            return TRUE;
        }
        catch (PDOException $ex)
        {
            return FALSE;
        }
    }
    
    function delete($code) {

        $pdo = new DbPDO();
        $sql = "DELETE FROM currency WHERE code = :code";
        $pdo->query($sql);
        $pdo->bind(':code', $code);

        try
        {
            $pdo->execute();
            return TRUE;
        }
        catch (PDOException $ex)
        {
            return FALSE;
        }
    }

}
