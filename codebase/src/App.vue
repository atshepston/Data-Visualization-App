<script setup lang="ts">
import GraphView from "./components/GraphView.vue";
</script>

<template>
  <main>
    <GraphView />
  </main>
</template>

<style scoped>
.center {
  margin: auto;
  padding: 10px;
}
#inner {
  border: 0.05em solid black;
}

#outer {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
