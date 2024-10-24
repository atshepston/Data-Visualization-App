<template>
    <div class="navbar">
        <h1>Algorithm Visualization</h1>

        <!-- toggle button to switch between searching(graph)/sorting(array) algos -->
        <button @click="toggleMode">
            Toggle to {{ graphToggled ? 'Search Algorithms' : 'Sort Algorithms' }}
        </button>
        <div>
            <label for="algorithm"></label>
            <select v-model="selectedAlgorithm" @change="handleSelection">
                <!-- v-model binds user selection to selectedAlgorithm -->
                <!-- when user changed selection, handleSelection is called -->
                <option disabled value="">Select Sort Algorithm</option> <!-- placeholder -->
                <option v-for="algorithm in toggledAlgorithms" :key="algorithm" :value="algorithm">
                    {{ algorithm }}
                </option>
            </select>
            <p>You selected: {{ selectedAlgorithm }}</p>
        </div>

    </div>
</template>
  
<script setup lang="ts">
import { ref, computed } from 'vue';

// want to keep track of whether graph or array view is toggled
// so that I can display the appropriate drop down
const graphToggled = ref(true);

//function calls when toggle button is clicked 
//should also switch between array view and graph view
const toggleMode = () => {
  graphToggled.value = !graphToggled.value;
}

const selectedAlgorithm = ref('');

//list of algorithm options for the drop down
const sortAlgorithms = ref([
  'Bubble Sort',
  'Quick Sort',
  'Merge Sort',
  'Selection Sort',
  'Insertion Sort',
]);
const searchAlgorithms = ref([
  'BFS',
  'DFS',
]);

//this determines whether the drop down should display search or sort algorithms
//depending on what the user toggles
const toggledAlgorithms = computed(() => {
  return graphToggled.value ? searchAlgorithms.value : sortAlgorithms.value;
});

let handleSelection = () => {
  console.log("User selects: " + selectedAlgorithm.value); 
};
</script>
  
  <style scoped>
  .navbar{
    display: flex;
    align-items: center;
    background-color: gray;
    color: white;
  }
  button {
    background-color: green;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>