$("#pesquisar").click(function(){ //É executado ao clicar no botão pesquisar
  //Pega os dados das inputs atraves dos IDs
  var from = document.getElementById('from').value;
  var to = document.getElementById('to').value;
  var valor = document.getElementById('valor').value;
  //Verifica se a moeda de origem e destino são iguais
  if(from == to){
    alert("Selecione moedas diferentes");
    return;
  }
  //Verifica se o valor para a conversão foi digitado
  if(valor === ''){
    alert("Insira um valor para que seja realizado a conversão");
    return;
  }
  //Busca informações em uma API externa com os 3 parametros passados
  $.get("json.php?from="+from+"&to="+to+"&amount="+valor, function(data){
    obj = JSON.parse(data);
    //pega o resultado da conversão e inseri na input que contem o ID resultado
    document.getElementById('resultado').innerHTML = obj.resultado;
  });

});
