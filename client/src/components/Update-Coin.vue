<template>
    <div name="update" align="start">
        <v-row align="center">
            <v-col cols="12">
                <v-card-title
                    >Selecione a moeda que deseja atualizar</v-card-title
                >
                <v-select
                    v-model="name"
                    label="Selecione a moeda que deseja atualizar"
                    outlined
                    rounded
                    :items="nameCoins"
                ></v-select>
                <v-text-field
                    v-model="value"
                    label="Digite o valor da moeda com base no dolar"
                    color="blue darken-2"
                    type="number"
                    outlined
                    rounded
                ></v-text-field>
                <btn
                    @exec="execute(name, value)"
                    msg="Atualizar moeda"
                    color="blue darken-2"
                    mdi="mdi-reload"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import btn from "./global/button";

import { updateCoin } from "./../services";

export default {
    components: { btn },
    data: () => ({
        name: "",
        value: ""
    }),
    methods: {
        ...mapActions(["showNotification"]),
        async execute(name, value) {
            let text;
            if (name == "") {
                text = "Selecione uma moeda";
                this.showNotification({ text, color: "red" });
                return;
            } else if (value == "") {
                text = "Insira um valor";
                this.showNotification({ text, color: "red" });
            } else {
                await updateCoin(name, value);
                text = "Operação realizada com sucesso";
                this.showNotification({ text, color: "green darken-2" });
            }
        }
    },
    computed: {
        ...mapGetters(["nameCoins"])
    }
};
</script>

<style></style>
