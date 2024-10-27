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
            <!-- will display all the numbers currently in the array -->
            <div v-for="(number, index) in array"
                :key="index"
                class="number"
                :style="getStyle(index)" 
            >
                {{ number }}
            </div>
        </div>
 
 
        <p>Array so far: {{ array }}</p>
    </div>
 </template>


  <script setup lang="ts">
    import { ref, defineEmits } from 'vue';
    import { bubbleSort } from '../algorithms/bubble'; // Import the bubble sort function
 
 
    // defineEmits creates a custom event to pass sorted array to parent (main.vue)
    const emit = defineEmits(['sortedArray']);
 
 
    //let submittedValue = ref('');
    let inputValue = ref('');
    let array = ref<number[]>([]); // create number array
 
 
    // will build the array with user inputs
    const handleSubmit = () => {
        // convert the input value to a number and push it into the array
        const number = parseFloat(inputValue.value); // converts input to a number
        if (!isNaN(number)) {
            array.value.push(number); // push the number into the array if it's valid
            positions.value.push(array.value.length - 1); // initialize position based on the index
        }
        inputValue.value = ''; // clear the input field after submission
    } 

    const clearArray = async () => {
        array.value  = []; // clears array
        positions.value = [];
        emit('sortedArray', array.value); // emit cleared array to parent 
    };
 
    // sort array with bubble sort
    const sortArray = async () => {
        await bubbleSort(array.value, positions.value, 2000, updateSwap); // Call bubble sort with updateSwap callback
        emit('sortedArray', array.value); // emit sorted array to parent
    };
    // callback function to update the array and positions during the swap
    const updateSwap = (newArray: number[], newPositions: number[]) => {
        array.value = newArray;
        positions.value = newPositions;
    };

    // const sortArray = () => {
    //     //sorts a copy of the array (not the original array)
    //     let sorted = bubbleSort([...array.value], array.value.length);
    //     //array.value = sorted;
    //     emit('sortedArray', sorted); // Emit sorted array to App.vue
    // }
 
 
    // VISUALIZATION and ANIMATION
    let sortedIndex = ref(0); // tracks current index of the sort
    let positions = ref<number[]>([]); // tracks the positions of numbers for animation
 
 
    // // function to get dynamic styles for animating positions
    // // animation function for sorting
    // const sortArray = async () => {
    //     for (let i = 0; i < array.value.length - 1; i++) {
    //         for (let j = 0; j < array.value.length - i - 1; j++) {
    //             if (array.value[j] > array.value[j + 1]) {
    //                 await swap(j, j + 1); // wait for the swap animation
    //             }
    //         }
    //         sortedIndex.value = i + 1; // update sorted section after each pass
    //     }
    //     emit('sortedArray', array.value); // emit sorted array to App.vue
    // };
 
 
    // // helper function to animate swapping
    // const swap = (a: number, b: number) => {
    //     return new Promise<void>((resolve) => {
    //         setTimeout(() => {
    //             // swap the elements in the array itself
    //             const temp = array.value[a];
    //             array.value[a] = array.value[b];
    //             array.value[b] = temp;
 
 
    //             // swap the positions for the animation
    //             const tempPos = positions.value[a];
    //             positions.value[a] = positions.value[b];
    //             positions.value[b] = tempPos;
 
 
    //             resolve();
    //         }, 1000); // Adjust the time for animation speed
    //     });
    // };
 
 
    const getStyle = (index: number) => {
        const posIndex = positions.value[index];
        //calculates distance to shift the element
        //the elements current index is index
        //the target index (where it needs to move) is posIndex
        const distance = (posIndex - index) * 60; // 60px per position difference
        console.log(`Moving element at index ${index} to position ${posIndex}, distance: ${distance}px`);
        return {
            //translateX moves the elements horizontally (along the x axis)
            transform: `translateX(${distance}px)`,
            transition: 'transform 2s ease',
        };
    };
    // VISUALIZATION and ANIMATION
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
    }
 
 
    .number {
        font-size: 24px;
        width: 50px;
        height: 50px; /* Added height */
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: lightblue; /* Add background color */
        border-radius: 5px; /* Optional: to make it look better */
        transition: transform 2s ease;
    }
 </style>
 
 