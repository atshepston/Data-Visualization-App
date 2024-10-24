<template>
    <div class="arrayInput">
        <form @submit.prevent="handleSubmit">
        <!-- Input Box -->
        <input v-model="inputValue" type="text" placeholder="Enter number" />

        <!-- Submit Button -->
        <button type="submit">Add</button>
        </form>

        <!-- Sort Button -->
        <button @click="sortArray">Sort</button>

        <p>Array so far: {{ array }}</p>
    </div>
</template>
  
<script setup lang="ts">
    import { ref, defineEmits } from 'vue';
    import { bubbleSort } from '../algorithms/bubble'; // Import the bubble sort function

    // defineEmits creates a custom event to pass sorted array to parent (App.vue)
    const emit = defineEmits(['sortedArray']);

    let submittedValue = ref('');
    let inputValue = ref('');
    let array = ref<number[]>([]); // create number array

    // will build the array with user inputs
    const handleSubmit = () => {
        // Convert the input value to a number and push it into the array
        const number = parseFloat(inputValue.value); // Converts input to a number
        if (!isNaN(number)) {
            array.value.push(number); // Push the number into the array if it's valid
        }
        inputValue.value = ''; // Clear the input field after submission
    }  

    const sortArray = () => {
        //sorts a copy of the array (not the original array)
        let sorted = bubbleSort([...array.value], array.value.length);
        //array.value = sorted;
        emit('sortedArray', sorted); // Emit sorted array to App.vue
    }
</script>
  
<style scoped>
  
  </style>