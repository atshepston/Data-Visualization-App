<template>
  <div class="array-input-container">
    <p class="array-display-text">Array so far: {{ array }}</p>
    <div class="input-form-container">
      <form
        @submit.prevent="handleSubmit"
        class="form-styles"
      >
        <input
          v-model="inputValue"
          type="text"
          placeholder="Enter number"
        />
        <button type="submit">Add</button>
        <button
          type="button"
          @click="clearArray"
        >
          Clear
        </button>
        <button
          type="button"
          @click="sortArray"
        >
          Sort
        </button>
        <button
          type="button"
          @click="generateArray"
        >
          Random
        </button>
      </form>
      <p
        v-if="error"
        class="error-message"
      >
        {{ error }}
      </p>
    </div>
    <div class="array-visualization-container">
      <div class="array-bars-container">
        <div
          v-for="(number, index) in array"
          :key="index"
          class="array-bar"
          :class="{
            'left-index': index === currentLeftIndex,
            'right-index': index === currentRightIndex,
            'sorted-index':
              currentSortedIndex !== null && index >= currentSortedIndex,
            //currentSortedIndex !== null && index <= currentSortedIndex, //need this line for selection sort
          }"
          :style="{
            height: `${number * (number / Math.max(...array)) * 7}px`,
            width: `${array.length < 20 ? 20 : 5}px`,
          }"
        >
          <span v-if="array.length <= 15">{{ number }}</span>
        </div>
      </div>
    </div>
    <div class="pseudo-code-container">
      <div
        v-for="(line, index) in pseudoCode"
        :key="index"
        :class="{ highlighted: currentLines.includes(index) }"
        :style="{
          paddingLeft: `${(line.match(/^(\s*)/)?.[0].length || 0) * 20}px`,
        }"
      >
        {{ line.trim() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineEmits } from "vue";
  import { bubbleSort } from "../algorithms/bubble";
  import { selectionSort } from "../algorithms/selection";
  import { insertionSort } from "../algorithms/insertion";

  const emit = defineEmits<{
    (event: "sortedArray", value: number[]): void;
  }>();

  const inputValue = ref("");
  const array = ref<number[]>([]);
  const error = ref("");

  let currentLeftIndex = ref<number | null>(null);
  let currentRightIndex = ref<number | null>(null);
  const currentLines = ref<number[]>([]);
  const currentSortedIndex = ref<number | null>(null);

  const pseudoCode = ref([
    "do",
    " swapped = false",
    " for index = 1 to index_of_last_unsorted_element - 1",
    "  if left_element > right_element",
    "   swap(left_element, right_element)",
    "   swapped = true;",
    "while swapped",
  ]);

  const bubbleSortPseudoCode = `do
   swapped = false
   for index = 1 to index_of_last_unsorted_element - 1
       if left_element > right_element
           swap(left_element, right_element)
           swapped = true;
while swapped`.split("\n");

  const insertionSortPseudoCode = `do
   swapped = false
   for index = 1 to index_of_last_unsorted_element - 1
      while left_element >=  0
          if left_element > right_element
              swap(left_element, right_element)
              swapped = true;
while swapped`.split("\n");

  const selectionSortPseudoCode =
    `for index = 0 to index_of_last_unsorted_element - 1
      find smallest unsorted element
      swap(left_element, right_element)`.split("\n");

  const updateLeftIndex = (index: number | null) => {
    currentLeftIndex.value = index;
  };

  const updateRightIndex = (index: number | null) => {
    currentRightIndex.value = index;
  };

  const setHighlightedLines = (lines: number[]) => {
    currentLines.value = lines;
  };

  const updateSortedIndex = (index: number | null) => {
    currentSortedIndex.value = index;
  };

  const resetValue = () => {
    currentLeftIndex.value = null;
    currentRightIndex.value = null;
    currentLines.value = [];
    currentSortedIndex.value = null;
    error.value = "";
  };

  const handleSubmit = () => {
    const numbers = inputValue.value
      .split(",")
      .map((num) => parseInt(num.trim()));
    if (numbers.length > 20) {
      error.value = "Array should not contain more than 20 numbers";
      return;
    }
    for (const num of numbers) {
      if (num > 50 || num < 0) {
        error.value = "Values should be between 0 and 50";
        return;
      }
      if (isNaN(num)) {
        error.value = "Invalid number detected";
        return;
      }
    }
    array.value = numbers;
    error.value = "";
  };

  const clearArray = () => {
    array.value = [];
    inputValue.value = "";
    emit("sortedArray", array.value);
    resetValue();
  };

  const sortArray = async () => {
    await bubbleSort({
      array: array.value,
      ms: 500,
      updateSwap: updateSwap,
      updateLeftIndex: updateLeftIndex,
      updateRightIndex: updateRightIndex,
      setHighlightedLines: setHighlightedLines,
      updateSortedIndex: updateSortedIndex,
    });
    // await insertionSort({
    //   array: array.value,
    //   ms: 500,
    //   updateSwap: updateSwap,
    //   updateLeftIndex: updateLeftIndex,
    //   updateRightIndex: updateRightIndex,
    //   setHighlightedLines: setHighlightedLines,
    // });
    // await selectionSort({
    //   array: array.value,
    //   ms: 500,
    //   updateSwap: updateSwap,
    //   updateLeftIndex: updateLeftIndex,
    //   updateRightIndex: updateRightIndex,
    //   setHighlightedLines: setHighlightedLines,
    //   updateSortedIndex: updateSortedIndex,
    // });
    emit("sortedArray", array.value);
    resetValue();
  };

  const generateArray = () => {
    const randomArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 50)
    );
    array.value = randomArray;
  };

  const updateSwap = (newArray: number[]) => {
    array.value = newArray;
  };
</script>

<style scoped>
  .array-input-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
  }

  .input-form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f7f9fc;
    padding: 20px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    border-radius: 8px;
    width: auto;
  }

  input[type="text"] {
    font-size: 14px;
    width: auto;
  }

  .form-styles {
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    width: auto;
  }

  button {
    padding: auto;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-family: monospace;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;
  }

  .error-message {
    color: red;
    font-size: medium;
    margin-top: 10px;
  }

  .array-display-text {
    font-size: 15px;
    font-family: monospace;
    text-align: center;
  }

  button:hover {
    background-color: #0056b3;
  }

  .array-visualization-container {
    justify-content: center;
    align-items: center;
  }

  .array-bars-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 1000px;
    height: 400px;
  }

  .array-bar {
    margin: 5px;
    padding: 10px;
    background-color: #007bff;
    border: 1px solid #ccc;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: background-color 0.3s, transform 0.3s;
  }

  .pseudo-code-container {
    background-color: #f7f9fc;
    padding: 20px;
    border-radius: 8px;
    width: auto;
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 14px;
    font-family: monospace;
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
