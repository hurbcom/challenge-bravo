<template>
  <div>
    <h4>---------------Conversor de Moedas------------------</h4>
    <h4 v-if="value">
      {{ value }} {{ nameFrom }} é igual a {{ valueConverted }}
      {{ nameTo }}
    </h4>
    <h4 v-else-if="!value">Selecione as moedas e digite o valor a ser convertido</h4>

    <select v-model="from">
      <option v-for="coin in nameCoins" :key="coin">{{ coin }}</option>
    </select>

    <input v-model="value" type="number" :placeholder="textTo" />

    <select v-model="to">
      <option v-for="coin in nameCoins" :key="coin">{{ coin }}</option>
    </select>

    <input v-if="value" v-model="valueConverted" disabled="true" :placeholder="textFrom" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { convertCoin } from "./../services";
import coinDictionary from "./../utils/coin-dictionary";
export default {
  data: () => ({
    to: "USD",
    from: "BRL",
    value: "1"
  }),
  beforeCreate() {
    this.convertCoin = convertCoin;
  },
  async created() {
    await this.getCoins();
  },
  methods: {
    ...mapActions(["getCoins"])
  },
  computed: {
    ...mapGetters(["nameCoins"]),
    textTo: vue => {
      return `Converter valor de ${vue.to} `;
    },
    textFrom: vue => {
      return `Valor será convertido para ${vue.from} `;
    },
    nameFrom: vue => {
      return `${coinDictionary[vue.from]}`;
    },
    nameTo: vue => {
      return `${coinDictionary[vue.to]}`;
    }
  },
  asyncComputed: {
    valueConverted: async vue => {
      if (vue.value) {
        var { convertedValue } = await vue.convertCoin(
          vue.from,
          vue.to,
          vue.value
        );
      } else {
        convertedValue = "";
      }
      return parseFloat(convertedValue).toPrecision(2);
    }
  }
};
</script>

<style></style>
