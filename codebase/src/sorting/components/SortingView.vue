<template>
  <div class="page">
    <h1>Array Sorting</h1>
    <!-- Call getSortedArray when the sortedArray event is emitted from ArrayInput -->
    <ArrayInput @sortedArray="getSortedArray" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import ArrayInput from "./ArrayInput.vue"; // Import the ArrayInput component

  // Store the sorted array
  const sortedArray = ref<number[]>([]);

  // Handle the sortedArray event from ArrayInput.vue
  const getSortedArray = (sorted: number[]) => {
    // Update the sorted array
    sortedArray.value = sorted;
  };
</script>

<style scoped>
  .page {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column; /* Stack items vertically */
    align-items: center; /* Center items horizontally */
    justify-content: center; /* Center items vertically */
    padding: 20px; /* Add padding around the container */
    box-sizing: border-box; /* Include padding in the width and height calculations */
  }

  h1 {
    margin: 0;
    color: black;
  }
</style>
