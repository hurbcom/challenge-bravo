<template>
    <div name="addCoin" align="start">
        <v-row align="center">
            <v-col cols="12">
                <v-text-field
                    v-model="name"
                    label="Digite a silga da moeda. Ex.: USD, BRL.."
                    color="green darken-2"
                    outlined
                    hide-details
                    rounded
                ></v-text-field>
                <v-card-title
                    >Digite o valor da moeda com base no valor em
                    dólar</v-card-title
                >
                <v-text-field
                    v-model="value"
                    label="Digite o valor da moeda com base no dolar."
                    color="green darken-2"
                    outlined
                    hide-details
                    rounded
                ></v-text-field>

                <btn
                    @exec="addCoin()"
                    msg="Adicionar moeda"
                    mdi="mdi-plus-circle-multiple"
                    color="green darken-2"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { createCoin } from "./../services";
import { mapActions } from "vuex";
import btn from "./global/button";
export default {
    components: { btn },
    data: () => ({
        name: "",
        value: ""
    }),
    methods: {
        ...mapActions(["showNotification"]),
        async addCoin() {
            let text;
            if (this.name == "" || this.value == "") {
                text = "Insira um nome ou valor válido";
                this.showNotification({ text, color: "red darken-2" });
                return;
            } else {
                await createCoin({ name: this.name, value: this.value });
                this.name = "";
                this.value = "";
                text = "Operação realizada com sucesso";
                this.showNotification({ text, color: "green darken-2" });
                return;
            }
        }
    }
};
</script>

<style></style>
