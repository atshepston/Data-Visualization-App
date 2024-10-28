<template>
    <div class="page">
        <h1>Array Sorting</h1>
        <!-- when custom event,sortedArray, emitted from ArrayInput is triggered,
        the function getSortedArray will be called -->
        <ArrayInput @sortedArray="getSortedArray" /> 
        <p>Sorted Array: {{ sortedArray }}</p>
    </div>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    import ArrayInput from './ArrayInput.vue'; // Import the ArrayInput component

    let sortedArray = ref<number[]>([]); // Store the sorted array

    // this function handles the event (sortedArray) from ArrayInput.vue
    // bubble sorted array is passed as an argument
    const getSortedArray = (sorted: number[]) => {
        sortedArray.value = sorted; // Update the sorted array
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
  /* div {
    width: 100%;
    height: 100%;
    background-color: rgb(0, 162, 255);
    display: flex;
    align-items: center;
    justify-content: center;
  } */
  h1 {
    margin: 0;
    color: black;
  }
  </style>