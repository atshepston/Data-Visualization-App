<template>
    <div class="arrayInput">
        <div class="form-container">
            <form @submit.prevent="handleSubmit" class="form-styles">
            <!-- Input Box -->
            <input v-model="inputValue" type="text" placeholder="Enter number" />
            <!-- Add/Submit Button -->
            <button type="submit">Add</button>
            </form>
        </div>
 
        <!-- Sort Button -->
        <button @click="clearArray">Clear</button>

        <!-- Sort Button -->
        <button @click="sortArray">Sort</button>
 
        <!-- Visualize Bubble Sort (swapping numbers) -->
        <div class="numbers-container">
            <!-- display each number as a new div -->
            <!-- number-div is will style each div -->
            <div 
                v-for="(number, index) in array" 
                :key="index" 
                class="number-div"
                :style="{ 
                    height: `${number*10}px`,
                    backgroundColor: currentInnerIndex === index ? 'green' : '#007bff' 
                }"
            >
                {{ number }}
            </div>
        </div>
 
 
        <p>Array so far: {{ array }}</p>
    </div>
 </template>


  <script setup lang="ts">
    import { ref, defineEmits, nextTick } from 'vue';
    import { bubbleSort } from '../algorithms/bubble'; // Import the bubble sort function
 
 
    // defineEmits creates a custom event to pass sorted array to parent (main.vue)
    const emit = defineEmits(['sortedArray']);

    let inputValue = ref('');
    let array = ref<number[]>([]); // array for logical sort
    
    let currentInnerIndex = ref<number | null>(null);

    const updateInnerIndex = (index: number | null) => {
        currentInnerIndex.value = index;
    };


 
    // will build the array with user inputs
    const handleSubmit = async () => {
        // convert the input value to a number and push it into the array
        const number = parseFloat(inputValue.value); // converts input to a number
        if (!isNaN(number)) {
            array.value.push(number); // push the number into the array if it's valid
        }
        inputValue.value = ''; // clear the input field after submission
    } 

    //when clear button is clicked, the array will be cleared
    const clearArray = async () => {
        array.value  = []; // clears array
        emit('sortedArray', array.value); // emit cleared array to parent 
    };
 
    // sort array with bubble sort
    const sortArray = async () => {
        await bubbleSort(array.value, 1000, updateSwap, updateInnerIndex); // Call bubble sort with updateSwap callback
        emit('sortedArray', array.value); // emit sorted array to parent
    };

    // callback function to update the array during the swap
    const updateSwap = (newArray: number[]) => {
        array.value = newArray;
        console.log("array updated!");
    };
 
 </script>



  <style scoped>

    .form-container {
        display: flex;
        justify-content: center; /* Center the form horizontally */
        align-items: center; /* Center the form vertically */
        background-color: #f7f9fc; /* Light background color */
        padding: 10px; /* Padding around the container */
    }

    .form-styles {
        background-color: white; /* White background for the form */
        border-radius: 8px; /* Rounded corners */
        padding: 10px; /* Padding inside the form */
        width: 200px; /* Fixed width for the form */
    }

    button {
        padding: 4px; /* Padding inside button */
        background-color: #007bff; /* Bootstrap primary color */
        color: white; /* White text */
        border: none; /* Remove default border */
        border-radius: 4px; /* Rounded corners */
        font-size: 14px; /* Font size */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background-color 0.3s; /* Transition effect for background color */
        margin-left: 5px; /* Add space above the button */

    }
    button:hover {
        background-color: #0056b3; /* Darker blue on hover */
    }

    .arrayInput {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        flex-direction: column;
        align-items: center; /* Center items horizontally */
        justify-content: center; /* Center items vertically if necessary */
        height: 100vh; /* Make sure the container takes the full viewport height */
    }
 
 
    .numbers-container {
        display: flex;
        justify-content: center; /* Center the numbers inside the container */
        gap: 10px;
        margin-top: 20px;
        align-items: flex-end;
    }

    /* styling for number divs (bars) */
    .number-div {
        margin: 5px;
        padding: 10px;
        background-color: #007bff;
        border: 1px solid #ccc;
        color: white;
        width: 5%;
        display: flex;
        align-items: center;   /* center numbers vertically */
        justify-content: center; /* center numbers horizontally */
        font-size: 14px;
    }
 </style>
 
 