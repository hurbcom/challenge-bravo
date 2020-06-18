<template>
    <div name="converter" align="start">
        <v-row align="center">
            <v-col cols="6">
                <v-row justify="center">
                    <v-card-title class="ma-4">{{ message }}</v-card-title>
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-row justify="center" class="ma-6">
                    <v-select
                        v-model="from"
                        :items="nameCoins"
                        label="Selecione a moeda de origem"
                        hide-details
                        outlined
                        rounded
                    ></v-select>
                </v-row>
                <v-row class="ma-6" justify="center">
                    <v-card-title>Valor a ser convertido</v-card-title>
                </v-row>
                <v-row justify="center" class="ma-6">
                    <v-text-field
                        v-model="value"
                        :label="textFrom"
                        type="number"
                        outlined
                        rounded
                    ></v-text-field>
                </v-row>
                <v-row justify="center" class="ma-6">
                    <v-select
                        v-model="to"
                        :items="nameCoins"
                        hide-details
                        label="Selecione a moeda para a qual você quer converter"
                        outlined
                        rounded
                    ></v-select>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { convertCoin } from "./../services";
import debounce from "lodash.debounce";
export default {
    data: () => ({
        to: "USD",
        from: "BRL",
        value: "1",
        message: ""
    }),
    beforeCreate() {
        this.convertCoin = convertCoin;
    },
    async created() {
        this.debouncedGetConvertedCoin = debounce(this.getConvertedCoin, 500);
        this.getConvertedCoin();
    },
    methods: {
        async getConvertedCoin() {
            var vue = this;
            if (vue.value) {
                var { convertedValue } = await vue.convertCoin(
                    vue.from,
                    vue.to,
                    vue.value
                );
                convertedValue = parseFloat(convertedValue).toPrecision(2);
                vue.message = `${this.value} ${this.from} é igual a ${convertedValue} ${this.to}`;
                return;
            } else {
                this.message =
                    "Selecione as moedas e digite o valor a ser convertido";
                return;
            }
        }
    },
    watch: {
        value: function() {
            this.message = "Esperando o valor...";
            this.debouncedGetConvertedCoin();
        },
        to: function() {
            this.debouncedGetConvertedCoin();
        },
        from: function() {
            this.debouncedGetConvertedCoin();
        }
    },
    computed: {
        ...mapGetters(["nameCoins"]),
        textFrom: vue => {
            return `Converter valor de ${vue.from} `;
        },
        textTo: vue => {
            return `Valor será convertido para ${vue.to} `;
        }
    }
};
</script>

<style></style>
