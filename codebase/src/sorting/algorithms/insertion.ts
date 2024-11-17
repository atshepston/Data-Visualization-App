import { swap, visualizationDelay } from "./bubble";

// Function to sort array using insertion sort
export const insertionSort = async ({
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
  };
}): Promise<number[]> => {
  let swapped;
  let sortedIndex = array.length;
  do {
    // Highlight "do"
    ui.setHighlightedLines([0]);
    swapped = false;
    // Highlight "swapped = false" and "for loop"
    ui.setHighlightedLines([1, 2]);
    for (let i = 1; i < sortedIndex; i++) {
      await visualizationDelay(ms);
      ui.updateLeftIndex(i);
      ui.updateRightIndex(i - 1);

      let j = i - 1;
      // Highlight "while left_element >=  0"
      ui.setHighlightedLines([3]);
      while (j >= 0) {
        ui.setHighlightedLines([4]);
        if (array[j] > array[j + 1]) {
          // Highlight "if condition"
          ui.setHighlightedLines([5, 6]);
          await swap({
            array: array,
            a: j + 1,
            b: j,
            ms: ms,
            updateSwap: ui.updateSwap,
            setHighlightedLines: ui.setHighlightedLines,
          });
          swapped = true;
          j = j - 1;
          await visualizationDelay(ms);
          ui.updateLeftIndex(j); // j might be -1
          ui.updateRightIndex(j + 1);
        } else {
          j = j - 1;
        }
      }
      ui.setHighlightedLines([7]);
      await visualizationDelay(ms);
    }
  } while (swapped);
  // Highlight "while condition"
  ui.setHighlightedLines([6]);
  // Reset indices
  ui.updateLeftIndex(null);
  ui.updateRightIndex(null);
  await visualizationDelay(ms);
  // Reset highlights
  ui.setHighlightedLines([]);
  // Return sorted array
  return array;
};
