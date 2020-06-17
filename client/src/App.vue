<template>
    <v-app>
        <v-card class="mx-auto" max-width="800">
            <v-card-title>Desafio Bravo - Conversor de Moedas</v-card-title>
            <div name="nav-bar">
                <v-bottom-navigation v-model="bottomNav">
                    <v-btn value="home">
                        <span>Início</span>
                        <v-icon>mdi-home</v-icon>
                    </v-btn>
                    <v-btn value="convertion">
                        <span>Conversor</span>
                        <v-icon>mdi-transfer-right</v-icon>
                    </v-btn>

                    <v-btn value="addCoin">
                        <span>Adicionar Moedas</span>
                        <v-icon color="green darken-2"
                            >mdi-plus-circle-multiple</v-icon
                        >
                    </v-btn>

                    <v-btn value="deleteCoin">
                        <span>Deletar Moedas</span>
                        <v-icon color="red darken-2"
                            >mdi-minus-circle-multiple</v-icon
                        >
                    </v-btn>
                    <v-btn value="updateCoin">
                        <span>Atualizar Moedas</span>
                        <v-icon color="blue darken-2">mdi-reload</v-icon>
                    </v-btn>
                </v-bottom-navigation>
            </div>
        </v-card>
    </v-app>
</template>

<script>
export default {
    name: "App",

    components: {},

    data: () => ({
        bottomNav: "home"
    })
};
</script>
