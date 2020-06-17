<template>
    <div name="delete" class="start">
        <v-row align="center">
            <v-col cols="12">
                <v-select
                    v-model="name"
                    :items="nameCoins"
                    label="Selecione a moeda a ser removida"
                    hide-details
                    outlined
                    rounded
                    color="red darken-2"
                ></v-select>
                <btn
                    @exec="removeCoin()"
                    msg="Remover moeda"
                    mdi="mdi-minus-circle-multiple"
                    color="red darken-2"
                />
            </v-col>
        </v-row>
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
        ...mapActions(["getCoins", "showNotification"]),
        async removeCoin() {
            let text;
            if (this.name == "") {
                text = "Selecione uma moeda";
                this.showNotification({ text, color: "red darken-2" });
                return;
            } else {
                await deleteCoin(this.name);

                this.name = "";
                await this.getCoins();

                text = "Operação realizada com sucesso";
                this.showNotification({ text, color: "green darken-2" });
                return;
            }
        }
    },
    computed: {
        ...mapGetters(["nameCoins"])
    }
};
</script>

<style></style>
