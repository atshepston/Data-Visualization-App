import { swap, delay } from "./bubble";

// Function to sort array using insertion sort
export const selectionSort = async ({
  array,
  ms,
  updateSwap,
  updateLeftIndex,
  updateRightIndex,
  updateCurrentLines,
  updateSortedIndex,
}: {
  array: number[];
  ms: number;
  updateSwap: (newArray: number[]) => void;
  updateLeftIndex: (index: number | null) => void;
  updateRightIndex: (index: number | null) => void;
  updateCurrentLines: (lines: number[]) => void;
  updateSortedIndex: (index: number | null) => void;
}): Promise<number[]> => {
  let sortedIndex = -1;
  let minIndex;

  // Highlight "for index = 0 to index_of_last_unsorted_element - 1"
  updateCurrentLines([0]);

  for (let i = 0; i < array.length; i++) {
    //i represents the index of the current elements
    // Visualization delay
    await delay(ms);
    updateLeftIndex(i);

    minIndex = i;
    // Find index of smallest element
    // Highlight "find smallest unsorted element"
    updateCurrentLines([1]);
    for (let j = i; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    // Visualization delay
    await delay(ms);
    updateRightIndex(minIndex);

    // Highlight "find smallest unsorted element"
    updateCurrentLines([2]);
    await swap(array, i, minIndex, ms, updateSwap, updateCurrentLines);

    // Visualization delay
    await delay(ms);
    updateLeftIndex(null);
    updateRightIndex(null);

    // Increase sorted index
    sortedIndex++;
    // Update sorted index
    updateSortedIndex(sortedIndex);
    // Visualization delay
    await delay(ms);
  }
  // Reset indices
  updateLeftIndex(null);
  updateRightIndex(null);
  // Visualization delay
  await delay(ms);
  // Reset highlights
  updateCurrentLines([]);
  // Return sorted array
  return array;
};
