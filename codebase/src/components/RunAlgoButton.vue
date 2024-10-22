<template>
    <button @click="runAlgorithm">Run</button>
</template>
  
  <script>
  export default {
    methods: {
      runAlgorithm() {
        alert('Algorithm running!');
      }
    }
  }
  </script>
  
  <style scoped>
  button {
    background-color: green;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>