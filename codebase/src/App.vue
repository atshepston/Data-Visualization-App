<script setup lang="ts">
import { ref } from 'vue';
import SortingPanel from './sorting/components/main.vue'
import ArrayInput from './sorting/components/ArrayInput.vue'; // Import the ArrayInput component

let sortedArray = ref<number[]>([]); // Store the sorted array

// this function handles the event (sortedArray) from ArrayInput.vue
// bubble sorted array is passed as an argument
const getSortedArray = (sorted: number[]) => {
  sortedArray.value = sorted; // Update the sorted array
};
</script>

<template>
  <div style="width: 100vw; height: 100vh">
  <SortingPanel />
  <!-- when custom event,sortedArray, emitted from ArrayInput is triggered,
    the function getSortedArray will be called -->
  <ArrayInput @sortedArray="getSortedArray" /> 
  <p>Sorted Array: {{ sortedArray }}</p>
</div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
