<template>
    <div class="arrayInput">
        <div class="form-container">
            <form @submit.prevent="handleSubmit" class="form-styles">
                <input v-model="inputValue" type="text" placeholder="Enter number" />
                <button type="submit">Add</button>
            </form>
        </div>

        <button @click="clearArray">Clear</button>
        <button @click="sortArray">Sort</button>

        <div class="numbers-container">
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

        <div class="pseudo-code-container">
            <pre v-for="(line, index) in pseudoCode" :key="index" :class="{ highlighted: currentLines.includes(index) }">
                {{ line }}
            </pre>
        </div>

        <p>Array so far: {{ array }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { bubbleSort } from '../algorithms/bubble';

const emit = defineEmits(['sortedArray']);

const inputValue = ref('');
const array = ref<number[]>([]);
let currentLeftIndex = ref<number | null>(null);
let currentRightIndex = ref<number | null>(null);
const currentLines = ref<number[]>([]);
const currentSortedIndex = ref<number | null>(null);

const pseudoCode = ref([
    "do", // Line 0
    "    swapped = false", // Line 1
    "    for index = 1 to index_of_last_unsorted_element - 1", // Line 2
    "        if left_element > right_element", // Line 3
    "            swap(left_element, right_element)", // Line 4
    "            swapped = true;", // Line 5
    "while swapped" // Line 6
]);

const updateLeftIndex = (index: number | null) => {
    currentLeftIndex.value = index;
};

const updateRightIndex = (index: number | null) => {
    currentRightIndex.value = index;
};

const updateCurrentLines = (lines: number[]) => {
    currentLines.value = lines;
};

const updateSortedIndex = (index: number | null) => {
    currentSortedIndex.value = index;
};

const reset = ()=> {
    currentLeftIndex.value = null;
    currentRightIndex.value = null;
    currentLines.value = [];
    currentSortedIndex.value = null;
}

const handleSubmit = () => {
    const number = parseFloat(inputValue.value);
    if (!isNaN(number)) {
        array.value.push(number);
    }
    inputValue.value = '';
};

const clearArray = () => {
    array.value = [];
    emit('sortedArray', array.value);
};

const sortArray = async () => {
    reset();
    await bubbleSort(array.value, 500, updateSwap, updateLeftIndex, updateRightIndex, updateCurrentLines, updateSortedIndex);
    emit('sortedArray', array.value);
};

const updateSwap = (newArray: number[]) => {
    array.value = newArray;
};
</script>

<style scoped>
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f7f9fc;
    padding: 10px;
}

.form-styles {
    background-color: white;
    border-radius: 8px;
    padding: 10px;
    width: 200px;
}

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

button:hover {
    background-color: #0056b3;
}

.arrayInput {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.numbers-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    align-items: flex-end;
}

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

.pseudo-code-container {
    margin-top: 20px;
    background-color: #f7f9fc;
    padding: 10px;
    border-radius: 8px;
    width: 100%;
}

.highlighted {
    background-color: yellow;
}

.left-index {
    background-color: green !important;
}

.right-index {
    background-color: green !important;
}

.sorted-index {
    background-color: orange !important;
}
</style>
