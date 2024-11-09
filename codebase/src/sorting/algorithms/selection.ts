import { swap, visualizationDelay } from "./bubble";

// Function to sort array using insertion sort
export const selectionSort = async ({
  array,
  ms,
  updateSwap,
  updateLeftIndex,
  updateRightIndex,
  setHighlightedLines,
  updateSortedIndex,
}: {
  array: number[];
  ms: number;
  updateSwap: (newArray: number[]) => void;
  updateLeftIndex: (index: number | null) => void;
  updateRightIndex: (index: number | null) => void;
  setHighlightedLines: (lines: number[]) => void;
  updateSortedIndex: (index: number | null) => void;
}): Promise<number[]> => {
  let sortedIndex = -1;
  let minIndex;

  // Highlight "for index = 0 to index_of_last_unsorted_element - 1"
  setHighlightedLines([0]);

  for (let i = 0; i < array.length; i++) {
    //i represents the index of the current elements
    await visualizationDelay(ms);
    updateLeftIndex(i);

    minIndex = i;
    // Find index of smallest element
    // Highlight "find smallest unsorted element"
    setHighlightedLines([1]);
    for (let j = i; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    await visualizationDelay(ms);
    updateRightIndex(minIndex);

    // Highlight "find smallest unsorted element"
    setHighlightedLines([2]);
    await swap({
      array: array,
      a: i,
      b: minIndex,
      ms: ms,
      updateSwap: updateSwap,
      setHighlightedLines: setHighlightedLines,
    });

    await visualizationDelay(ms);
    updateLeftIndex(null);
    updateRightIndex(null);

    sortedIndex++;
    updateSortedIndex(sortedIndex);
    await visualizationDelay(ms);
  }
  // Reset indices
  updateLeftIndex(null);
  updateRightIndex(null);

  await visualizationDelay(ms);
  // Reset highlights
  setHighlightedLines([]);
  // Return sorted array
  return array;
};
