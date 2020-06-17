<template>
    <v-app>
        <v-card class="mx-auto" max-width="800">
            <v-card-title>Desafio Bravo - Conversor de Moedas</v-card-title>
            <div name="nav-bar">
                <v-bottom-navigation color="black">
                    <v-btn bottomNav="home">
                        <span>Início</span>
                        <v-icon>mdi-home</v-icon>
                    </v-btn>
                    <v-btn @click="bottomNav = 'converter'">
                        <span>Conversor</span>
                        <v-icon color="yellow darken-1"
                            >mdi-transfer-right</v-icon
                        >
                    </v-btn>

                    <v-btn @click="bottomNav = 'addCoin'">
                        <span>Adicionar Moedas</span>
                        <v-icon color="green darken-2"
                            >mdi-plus-circle-multiple</v-icon
                        >
                    </v-btn>

                    <v-btn @click="bottomNav = 'deleteCoin'">
                        <span>Deletar Moedas</span>
                        <v-icon color="red darken-2"
                            >mdi-minus-circle-multiple</v-icon
                        >
                    </v-btn>

                    <v-btn @click="bottomNav = 'updateCoin'">
                        <span>Atualizar Moedas</span>
                        <v-icon color="blue darken-2">mdi-reload</v-icon>
                    </v-btn>
                </v-bottom-navigation>
            </div>
            <div name="converter" v-if="bottomNav == 'converter'">
                <converter />
            </div>
            <div name="add" v-if="bottomNav == 'addCoin'">
                <add-coin />
            </div>
            <div name="delete" v-if="bottomNav == 'deleteCoin'">
                <deleteCoin />
            </div>
            <div name="update" v-if="bottomNav == 'updateCoin'">
                <update-coin />
            </div>
        </v-card>
        <v-snackbar
            v-model="snackbar.status"
            :color="snackbar.color"
            :timeout="snackbar.timeout"
        >
            <div class="flex row justify-center">
                {{ snackbar.text }}
            </div>
        </v-snackbar>
        <v-footer app absolute class="font-weight-medium">
            <v-col class="text-center" cols="12">
                {{ new Date().getFullYear() }} —
                <strong>Com ❤️ Luccas Maia</strong>
            </v-col>
        </v-footer>
    </v-app>
</template>

<script>
import converter from "./components/Converter";
import addCoin from "./components/Add-Coin";
import deleteCoin from "./components/Delete-coin";
import updateCoin from "./components/Update-Coin";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "App",

    components: { converter, addCoin, deleteCoin, updateCoin },

    data: () => ({
        bottomNav: "home"
    }),
    async created() {
        if (!this.nameCoins.length) {
            await this.getCoins();
        }
    },
    methods: {
        ...mapActions(["getCoins"])
    },
    computed: {
        ...mapState(["snackbar"]),
        ...mapGetters(["nameCoins"])
    }
};
</script>
