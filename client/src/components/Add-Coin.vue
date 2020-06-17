<template>
    <div>
        <custom-input
            v-model="name"
            type="text"
            placeholder="Digite a sigla da moeda. Ex.: USD, BRL"
        />
        <p>Digite o valor da moeda com base no valor em dólar</p>
        <custom-input
            v-model="value"
            type="number"
            placeholder="Digite o valor da moeda com base no dolar"
        />
        <btn
            @exec="addCoin()"
            msg="Adicionar moeda"
            mdi="mdi-plus-circle-multiple"
            color="success"
        />
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { createCoin } from "./../services";
import btn from "./global/button";
import customInput from "./global/input";
export default {
    components: { btn, customInput },
    data: () => ({
        name: "",
        value: ""
    }),
    methods: {
        ...mapActions(["getCoins"]),
        async addCoin() {
            if (this.name == "" || this.value == "") {
                console.log("Insira um nome ou valor válido");
                return;
            } else {
                console.log(
                    await createCoin({ name: this.name, value: this.value })
                );
                await this.getCoins();
                return;
            }
        }
    }
};
</script>

<style></style>
