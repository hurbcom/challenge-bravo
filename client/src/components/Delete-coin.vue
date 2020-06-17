<template>
  <div>
    <h4>---------------Remover Moedas------------------</h4>
    <select v-model="name">
      <option v-for="coin in nameCoins" :key="coin">{{ coin }}</option>
    </select>
    <btn @exec="removeCoin()" msg="Remover moeda" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import btn from "./global/button";
import { deleteCoin } from "./../services";
export default {
  components: { btn },
  data: () => ({
    name: ""
  }),
  methods: {
    ...mapActions["getOrders"],
    async removeCoin() {
      if (this.name == "") {
        console.log("Selecione uma moeda");
        return;
      } else {
        console.log(await deleteCoin(this.name));
        this.name = "";
        await this.getCoins();
        return;
      }
    }
  },
  computed: {
    ...mapGetters(["nameCoins"])
  }
};
</script>

<style>
</style>