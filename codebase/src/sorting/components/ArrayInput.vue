<template>
    <!-- Main container for the array input component -->
    <div class="arrayInput">
        <!-- Form container for input and add button -->
        <div class="form-container">
            <!-- Form to handle number input and submission -->
            <form @submit.prevent="handleSubmit" class="form-styles">
                <!-- Input field for entering numbers -->
                <input v-model="inputValue" type="text" placeholder="Enter number" />
                <!-- Button to add number to array -->
                <button type="submit">Add</button>
            </form>
        </div>

        <!-- Button to clear the array -->
        <button @click="clearArray">Clear</button>
        <!-- Button to sort the array -->
        <button @click="sortArray">Sort</button>

        <!-- Container to display the numbers in the array -->
        <div class="numbers-container">
            <!-- Loop through the array and display each number -->
            <div 
                v-for="(number, index) in array" 
                :key="index" 
                class="number-div"
                :class="{
                    'left-index': index === currentLeftIndex,
                    'right-index': index === currentRightIndex,
                    'sorted-index': currentSortedIndex !== null && index >= currentSortedIndex
                }"
                :style="{ 
                    height: `${number * 10}px`
                }"
            >
                {{ number }}
            </div>
        </div>

        <!-- Container to display the pseudo code for the sorting algorithm -->
        <div class="pseudo-code-container">
            <!-- Loop through the pseudo code lines and display each line -->
            <pre v-for="(line, index) in pseudoCode" :key="index" :class="{ highlighted: currentLines.includes(index) }">
                {{ line }}
            </pre>
        </div>

        <!-- Display the current state of the array -->
        <p>Array so far: {{ array }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { bubbleSort } from '../algorithms/bubble';

// Define custom event to emit sorted array
const emit = defineEmits(['sortedArray']);

// Reactive references for input value and array of numbers
const inputValue = ref('');
const array = ref<number[]>([]);

// Reactive references for sorting state
let currentLeftIndex = ref<number | null>(null);
let currentRightIndex = ref<number | null>(null);
const currentLines = ref<number[]>([]);
const currentSortedIndex = ref<number | null>(null);

// Pseudo code for the bubble sort algorithm
const pseudoCode = ref([
    "do", // Line 0
    "    swapped = false", // Line 1
    "    for index = 1 to index_of_last_unsorted_element - 1", // Line 2
    "        if left_element > right_element", // Line 3
    "            swap(left_element, right_element)", // Line 4
    "            swapped = true;", // Line 5
    "while swapped" // Line 6
]);

// Function to update the left index during sorting
const updateLeftIndex = (index: number | null) => {
    currentLeftIndex.value = index;
};

// Function to update the right index during sorting
const updateRightIndex = (index: number | null) => {
    currentRightIndex.value = index;
};

// Function to update the current lines of pseudo code being highlighted
const updateCurrentLines = (lines: number[]) => {
    currentLines.value = lines;
};

// Function to update the current sorted index
const updateSortedIndex = (index: number | null) => {
    currentSortedIndex.value = index;
};

// Function to reset the sorting state
const reset = () => {
    currentLeftIndex.value = null;
    currentRightIndex.value = null;
    currentLines.value = [];
    currentSortedIndex.value = null;
};

// Function to handle form submission and add number to array
const handleSubmit = () => {
    array.value = [];
    const numbers = inputValue.value.split(',').map((num) => parseInt(num.trim()));
    numbers.forEach((num) => {
        if (!isNaN(num)) {
            array.value.push(num);
        }
    });
};

// Function to clear the array
const clearArray = () => {
    array.value = [];
    emit('sortedArray', array.value);
};

// Function to sort the array using bubble sort algorithm
const sortArray = async () => {
    await bubbleSort(array.value, 500, updateSwap, updateLeftIndex, updateRightIndex, updateCurrentLines, updateSortedIndex);
    emit('sortedArray', array.value);
    reset();
};

// Function to update the array after a swap during sorting
const updateSwap = (newArray: number[]) => {
    array.value = newArray;
};
</script>

<style scoped>
/* Styles for the form container */
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f7f9fc;
    padding: 10px;
}

/* Styles for the form */
.form-styles {
    background-color: white;
    border-radius: 8px;
    padding: 10px;
    width: 200px;
}

/* Styles for buttons */
button {
    padding: 4px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 5px;
}

/* Hover effect for buttons */
button:hover {
    background-color: #0056b3;
}

/* Styles for the main array input container */
.arrayInput {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

/* Styles for the numbers container */
.numbers-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    align-items: flex-end;
}

/* Styles for each number div */
.number-div {
    margin: 5px;
    padding: 10px;
    background-color: #007bff;
    border: 1px solid #ccc;
    color: white;
    width: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: background-color 0.3s, transform 0.3s;
}

/* Styles for the pseudo code container */
.pseudo-code-container {
    margin-top: 20px;
    background-color: #f7f9fc;
    padding-right: 20%;
    border-radius: 8px;
    width: auto;
    font-size: 14px;
}

/* Styles for highlighted pseudo code lines */
.highlighted {
    background-color: yellow;
}

/* Styles for left index during sorting */
.left-index {
    background-color: green !important;
}

/* Styles for right index during sorting */
.right-index {
    background-color: green !important;
}

/* Styles for sorted index */
.sorted-index {
    background-color: orange !important;
}
</style>
