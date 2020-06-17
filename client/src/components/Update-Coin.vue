<template>
  <div>
    <h4>---------------Atualizar Moedas------------------</h4>
    <h5>Selecione a moeda que deseja atualizar</h5>
    <select v-model="name">
      <option v-for="coin in nameCoins" :key="coin">{{ coin }}</option>
    </select>
    <custom-input
      v-model="value"
      type="number"
      placeholder="Digite o valor da moeda com base no dolar"
    />
    <btn @exec="execute(name, value)" msg="Atualizar moeda" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import btn from "./global/button";
import customInput from "./global/input";

import { updateCoin } from "./../services";

export default {
  components: { btn, customInput },
  data: () => ({
    name: "",
    value: ""
  }),
  methods: {
    ...mapActions(["getCoins"]),
    async execute(name, value) {
      if (name == "") {
        console.log("Selecione uma moeda");
        return;
      } else if (value == "") {
        console.log("Insira um valor");
      } else {
        console.log(await updateCoin(name, value));
        await this.getCoins();
      }
    }
  },
  computed: {
    ...mapGetters(["nameCoins"])
  }
};
</script>

<style></style>
