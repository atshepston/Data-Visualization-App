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
  let swapped;
  let sortedIndex = array.length;
  do {
    let curElem;
    let minElem;

    // Highlight "do"
    updateCurrentLines([0]);
    swapped = false;
    // Highlight "swapped = false" and "for loop"
    updateCurrentLines([1, 2]);
    for (let i = 0; i < sortedIndex; i++) {
      // Visualization delay
      await delay(ms);
      updateLeftIndex(i);
      //updateRightIndex(i + 1);

      let j = i;
      // Highlight "while left_element >=  0"
      updateCurrentLines([3]);
      while (j <= sortedIndex && swapped === false) {
        //find smallest element in unsorted section
        updateCurrentLines([4]);
        if (array[j] < array[i]) {
          // Highlight "if condition"
          updateCurrentLines([5, 6]);
          await swap(array, i, j, ms, updateSwap, updateCurrentLines);
          swapped = true;
          await delay(ms);
          updateLeftIndex(i + 1);
          //updateLeftIndex(j); // j might be -1
          //updateRightIndex(i);
        } else {
          j = j + 1;
          updateRightIndex(j);
        }
      }
      // Visualization delay
      updateCurrentLines([7]);
      updateSortedIndex(j);
      await delay(ms);
    }
  } while (swapped);
  // Highlight "while condition"
  updateCurrentLines([6]);
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
