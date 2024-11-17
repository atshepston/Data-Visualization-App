import { swap, visualizationDelay } from "./bubble";

// Function to sort array using insertion sort
export const selectionSort = async ({
  array,
  ms,
  ui,
}: {
  array: number[];
  ms: number;
  ui: {
    updateSwap: (newArray: number[]) => void;
    updateLeftIndex: (index: number | null) => void;
    updateRightIndex: (index: number | null) => void;
    setHighlightedLines: (lines: number[]) => void;
    updateSortedIndex: (index: number | null) => void;
  };
}): Promise<number[]> => {
  let sortedIndex = -1;
  let minIndex;

  // Highlight "for index = 0 to index_of_last_unsorted_element - 1"
  ui.setHighlightedLines([0]);

  for (let i = 0; i < array.length; i++) {
    //i represents the index of the current elements
    await visualizationDelay(ms);
    ui.updateLeftIndex(i);

    minIndex = i;
    // Find index of smallest element
    // Highlight "find smallest unsorted element"
    ui.setHighlightedLines([1]);
    for (let j = i; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    await visualizationDelay(ms);
    ui.updateRightIndex(minIndex);

    // Highlight "find smallest unsorted element"
    ui.setHighlightedLines([2]);
    await swap({
      array: array,
      a: i,
      b: minIndex,
      ms: ms,
      updateSwap: ui.updateSwap,
      setHighlightedLines: ui.setHighlightedLines,
    });

    await visualizationDelay(ms);
    ui.updateLeftIndex(null);
    ui.updateRightIndex(null);

    sortedIndex++;
    ui.updateSortedIndex(sortedIndex);
    await visualizationDelay(ms);
  }
  // Reset indices
  ui.updateLeftIndex(null);
  ui.updateRightIndex(null);

  await visualizationDelay(ms);
  // Reset highlights
  ui.setHighlightedLines([]);
  // Return sorted array
  return array;
};
