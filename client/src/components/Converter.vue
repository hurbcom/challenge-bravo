<template>
  <h3>{{from}}</h3>
</template>

<script>
export default {
  data: () => ({
    from: String
  }),
  created() {
    this.from = "BRL";
  }
};
</script>

<style>
</style>