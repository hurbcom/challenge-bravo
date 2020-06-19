<template>
  <div name="addCoin" align="start">
    <v-row align="center">
      <v-col cols="12">
        <v-card-title>Bem-vindo ao Conversor de Moedas</v-card-title>
        <v-card-text>
          A aplicação é tem como principal função a conversão de moedas, porém também é capaz de realizar criação,
          atualização, exclusão e listagem de moedas.
        </v-card-text>
        <v-card-text>
          O valor base utilizado para conversão foi o Dólar Americano (lastro), então para inclusão e atualização de uma nova moeda,
          seu valor deve ser baseado no valor de 1 dólar. Exemplo: Para adicionar a moeda Euro,
          deve informar o valor de x Euros equivalente a 1 dólar.
        </v-card-text>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>