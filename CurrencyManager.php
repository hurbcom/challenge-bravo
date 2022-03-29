<?php

  require_once('CurrencyDAO.php');

  Class CurrencyManager{

    // chave obtida mediante cadastro para uso não comercial da API
    private $apiKey = 'CHAVE_AUTENTICACAO_AQUI';


    // Este método foi criado para popular o BD.
    // Será utilizado somente caso o BD challenge-bravo-DB.sql esteja vazio
    function populateDB(){

      // instanciação das classes de modelo e acesso ao BD (DAO)
      $curr = new Currency();
      $dao = new CurrencyDAO();

      //solicita à API externa os códigos e nomes das moedas
      $currencies = $this->getCurrenciesList();

      // insere cada resultado no BD da API challenge-bravo
      foreach ($currencies as $key => $value) {

        $curr->setCode($key);
        $curr->setName($value);
        $curr->setSrc("external");

        $dao->insert($curr);

      }

      // insere as cotações e horário de atualização para cada moeda
      $this->updateCurrencies();

    }

    // Este método é utilizado para obter a lista de códigos e nomes das moedas da API externa.
    // É utilizado para auxiliar o método anterior "populateDB".
    function getCurrenciesList() {

      // Código recomendado pela documentação da API externa
      // fonte: https://currencyapi.net/documentation

      $curl = curl_init();

      curl_setopt_array($curl, [
      CURLOPT_URL => 'https://currencyapi.net/api/v1/currencies?key='.$this->apiKey.'&output=JSON',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'GET',
      ]);
      $response = curl_exec($curl);
      curl_close($curl);
      // fim do código recomendado pela documentação da API externa

      //transforma o objeto JSON, recebido pela API externa, em um vetor associativo
      $currencies = json_decode($response, true);
      //utiliza somente a posição que contém os nomes e códigos das moedas
      $currencies = $currencies['currencies'];

      return $currencies;

    }

    // Este método é utilizado para receber as cotações da API externa.
    // É usado no método "updateCurrencies()" para atualizar o BD desta API.
    function getExternalAPIRates() {

      // Código recomendado pela documentação da API externa
      // fonte: https://currencyapi.net/documentation
      $curl = curl_init();

      curl_setopt_array($curl, [
      CURLOPT_URL => 'https://currencyapi.net/api/v1/rates?key='.$this->apiKey.'&output=JSON',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'GET',
      ]);
      $response = curl_exec($curl);
      curl_close($curl);
      // fim do código recomendado pela documentação da API externa

      // retorna um vetor associativo do objeto JSON recebido pela API externa
      return json_decode($response, true);

    }

    // Este método é chamado pelo método convertCurrency sempre que é verificado que a última
    // atualização foi feita há mais de 1 hora.
    function updateCurrencies() {

      // faz uma requisição para as cotações da API externa
      $apiRates = $this->getExternalAPIRates();
      // seleciona a posição que informa o horário da última atualização
      $updated = $apiRates['updated'];
      // seleciona a posição com o vetor das cotações
      $rates = $apiRates['rates'];

      $curr = new Currency();
      $dao = new CurrencyDAO();

      // percorre as cotações atualizando seus valores no BD
      foreach ($rates as $key => $value) {

        $curr->setCode($key);
        $curr->setRate($value);
        $curr->setLastUpdate($updated);

        $dao->update($curr);

      }

    }

    // requisito do desafio para realizar a conversão de moedas
    function convertCurrency($from, $to, $amount): array{

      // vetor utilizado para gerar a resposta ao endpoint
      $response = array(
        "error" => '',
        "result" => '',
        "msg"=>''
      );

      if($amount <= 0){

        $response['error'] = true;
        $response['msg'] = "O montante deve ser um número maior que zero";

        return $response;
      }

      $dao = new CurrencyDAO();

      $dbSyncInfo = $dao->selectLastUpdateFromExternal();

      /*
      verifica se há necessidade de atualizar as cotações no BD,
      já que a API externa atualiza seus valores somente de hora em hora.
      */
      if((time() - $dbSyncInfo['lastUpdate']) > 3600){

        $this->updateCurrencies();

      }

      // seleciona as moedas (se existirem) no BD
      $from = $dao->selectByCode($from);
      $to = $dao->selectByCode($to);

      // verifica a existência das moedas no BD
      if(!empty($from) && !empty($to)){

        // verifica a cotação entre as moedas recebidas, multiplica pelo montante e retorna o valor obtido
        $response['error'] = false;
        $response['result'] = $amount * ($to->getRate()/$from->getRate());
        $response['msg'] = "conversão concluída com sucesso";

        return $response;

      }else{
        // verifica se as duas moedas não existem
        if(empty($from) && empty($to)) {
          $response['error'] = true;
          $response['msg'] = "Não há moedas associadas aos códigos informado nos parâmetros TO e FROM";

          return $response;

        }elseif(empty($from)){
          $response['error'] = true;
          $response['msg'] = "Não há moeda associada ao código informado no parâmetro FROM";

          return $response;
        }elseif(empty($to)){
          $response['error'] = true;
          $response['msg'] = "Não há moeda associada ao código informado no parâmetro TO";

          return $response;
        }
      }

    }

    // requisito do desafio para realizar a adição de moedas fictícias
    function addCurrency($code, $name, $rate): array {

      $response = array(
        "error" => '',
        "msg"=>''
      );

      if($rate <= 0){
        $response['error'] = true;
        $response['msg'] = "A cotação deve ser um número maior que zero";

        return $response;
      }

      $curr = new Currency();

      $curr->setCode($code);
      $curr->setName($name);
      $curr->setRate($rate);
      $curr->setSrc('internal');
      $curr->setLastUpdate(time());

      $dao = new CurrencyDAO();

      $dbMsg = $dao->insert($curr);

      if(empty($dbMsg)){

        $response['error'] = false;
        $response['msg'] = "Moeda ". $name ." adicionada com sucesso";

        return $response;

      }elseif(strpos($dbMsg, "Data too long for column 'code'") == true){

        $response['error'] = true;
        $response['msg'] = "O código da moeda deve possuir, no máximo, quatro (04) caracteres";

        return $response;

      }elseif((strpos($dbMsg, "Duplicate entry")  == true) && (strpos($dbMsg, "code")  == true)){

        $response['error'] = true;
        $response['msg'] = "Já existe uma moeda com o código informado";

        return $response;

      }elseif((strpos($dbMsg, "Duplicate entry")  == true) && (strpos($dbMsg, "name")  == true)){

        $response['error'] = true;
        $response['msg'] = "Já existe uma moeda com o nome informado";

        return $response;

      }

    }

    //requisito para atualização das moedas inseridas na API
    function updateCurrency($code, $rate): array{

      $response = array(
        "error" => '',
        "msg"=>''
      );

      if($rate <= 0){
        $response['error'] = true;
        $response['msg'] = "A cotação deve ser um número maior que zero";

        return $response;
      }

      $dao = new CurrencyDAO();

      $curr = $dao->selectByCode($code);

      if(empty($curr)){

        $response['error'] = true;
        $response['msg'] = "Não foi encontrada nenhuma moeda com o código informado";

        return $response;

      }else{

        if($curr->getSrc() == 'external'){
          $response['error'] = true;
          $response['msg'] = "Somente é possível alterar cotações de moedas criadas a partir desta API";

          return $response;

        }else{

          $curr->setRate($rate);

          $dbMsg = $dao->update($curr);

          if(empty($dbMsg)){

            $response['error'] = false;
            $response['msg'] = "Cotação da moeda ". $curr->getName() ." alterada com sucesso";

            return $response;

          }else{

            // cria um registro do ocorrido
            $myfile = fopen("falhaAtualizacaoMoeda.txt", "a");
            $txt = date("d-m-Y G:i:s")." ".$dbMsg."\n";
            fwrite($myfile, $txt);
            fclose($myfile);

            $response['error'] = true;
            $response['msg'] = "Ocorreu um problema, tente novamente mais tarde.";

            return $response;

          }


        }
      }

    }

    //requisito para deleção das moedas inseridas na API
    function removeCurrency($code): array{

      $response = array(
        "error" => '',
        "msg"=>''
      );

      $dao = new CurrencyDAO();

      $curr = $dao->selectByCode($code);

      if(!isset($curr) || empty($curr)){

        $response['error'] = true;
        $response['msg'] = "Não foi encontrada nenhuma moeda com o código informado";

        return $response;

      }else{
        if($curr->getSrc() == 'external'){
          $response['error'] = true;
          $response['msg'] = "Somente é possível remover moedas criadas a partir desta API";

          return $response;

        }else{

          $dbMsg = $dao->delete($curr);

          if(empty($dbMsg)){

            $response['error'] = false;
            $response['msg'] = "Moeda ". $curr->getName() ." removida com sucesso";

            return $response;

          }else{

            // cria um registro do ocorrido
            $myfile = fopen("falhaRemocaoMoeda.txt", "a");
            $txt = date("d-m-Y G:i:s")." ".$dbMsg."\n";
            fwrite($myfile, $txt);
            fclose($myfile);

            $response['error'] = true;
            $response['msg'] = "Ocorreu um problema, tente novamente mais tarde.";

            return $response;

          }

        }
      }

    }


  }

 ?>
