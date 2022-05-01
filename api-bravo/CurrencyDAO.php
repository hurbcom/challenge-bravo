<?php

  require_once('Currency.php');
  require_once('ConnectionFactory.php');

  class CurrencyDAO {

    public function selectByCode(string $code) : ?Currency {

      $curr = null;

  		try {
  			$conn = new ConnectionFactory();
        $conn = $conn->getConnection();

  			$stmt = $conn->prepare("select * from Currency where code = :code");
  			$stmt->bindValue(':code', $code, PDO::PARAM_STR);
  			$stmt->execute();

  			$stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetch();

  			if(!empty($result)) {

  			  $curr = new Currency();

  				$curr->setId($result["id"]);
          $curr->setCode($result["code"]);
  				$curr->setName($result["name"]);
  				$curr->setRate($result["rate"]);
          $curr->setSrc($result["src"]);
          $curr->setLastUpdate($result["lastUpdate"]);

  			}

  			$stmt->closeCursor();
  			$con = null;

  			return $curr;

  		}catch(Exception $ex){

      	return null;

  		}

    }


    // importante para verificar a sincronização com a API externa
    public function selectLastUpdateFromExternal() {

      try{

        $conn = new ConnectionFactory();
        $conn = $conn->getConnection();

        $stmt = $conn->prepare("select distinct lastUpdate from Currency where src = 'external'");
        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetch();

        $stmt->closeCursor();
        $con = null;

        return $result;

      }catch(PDOException $ex){

        return null;

      }

    }


    public function insert(Currency $curr): ?string {

      try {

        $conn = new ConnectionFactory();
        $conn = $conn->getConnection();

        $stmt = $conn->prepare("insert into Currency (code, name, rate, src, lastUpdate)
          values (upper(:code), :name, ifnull(:rate, 0), :src, ifnull(:lastUpdate, 0))");

        $stmt->bindValue(':code', $curr->getCode(), PDO::PARAM_STR);
        $stmt->bindValue(':name', $curr->getName(), PDO::PARAM_STR);
        $stmt->bindValue(':rate', $curr->getRate(), PDO::PARAM_STR);
        $stmt->bindValue(':src', $curr->getSrc(), PDO::PARAM_STR);
        $stmt->bindValue(':lastUpdate', $curr->getLastUpdate(), PDO::PARAM_INT);

        $stmt->execute();

        $stmt->closeCursor();
        $con = null;

        return null;

      }catch(PDOException $ex){

        return $ex->getMessage();

      }

    }


    public function update(Currency $curr): ?string {

      try {

        $conn = new ConnectionFactory();
        $conn = $conn->getConnection();

        $stmt = $conn->prepare("update Currency set rate = :rate, lastUpdate = :lastUpdate where code = :code");

        $stmt->bindValue(':code', $curr->getCode(), PDO::PARAM_STR);
        $stmt->bindValue(':rate', $curr->getRate(), PDO::PARAM_STR);
        $stmt->bindValue(':lastUpdate', $curr->getLastUpdate(), PDO::PARAM_INT);

        $stmt->execute();

        $stmt->closeCursor();
        $con = null;

        return null;

      }catch(PDOException $ex){

        return $ex->getMessage();

      }

    }


    public function delete(Currency $curr): ?string {

      try {

        $conn = new ConnectionFactory();
        $conn = $conn->getConnection();

        $stmt = $conn->prepare("delete from Currency where code = :code");

        $stmt->bindValue(':code', $curr->getCode(), PDO::PARAM_STR);

        $stmt->execute();

        $stmt->closeCursor();
        $con = null;

        return null;

      }catch(PDOException $ex){

        return $ex->getMessage();

      }

    }

  }


 ?>
