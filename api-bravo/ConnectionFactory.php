<?php

class ConnectionFactory {

    private $server = "mysql";
    private $db = "challenge-bravo";
    private $user = "admin";
    private $pass = "s3nh@adm1n";

    private $conn;

    function __construct(){

        try {
            $this->conn = new PDO("mysql:host=$this->server;dbname=$this->db", $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch(PDOException $ex) {
            // $myfile = fopen("falhaConexaoBanco.txt", "a");
            // $txt = date("d-m-Y G:i:s")." ".$ex->getMessage()."\n";
            // fwrite($myfile, $txt);
            // fclose($myfile);
            echo $ex->getMessage();
            return null;
        }

    }


    public function getConnection(){
        return $this->conn;
    }

}

?>
