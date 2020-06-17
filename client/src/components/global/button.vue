<template>
  <div>
    <v-btn @click="execute()" class="ma-2" outlined rounded :color="color">
      <v-icon left>{{ mdi }}</v-icon>
      {{ msg }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
    mdi: String,
    color: String
  },
  methods: {
    async execute() {
      this.$emit("exec");
    }
  }
};
</script>

<style></style>
