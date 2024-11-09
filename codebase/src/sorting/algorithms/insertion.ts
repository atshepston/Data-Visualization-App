import { swap, visualizationDelay } from "./bubble";

// Function to sort array using insertion sort
export const insertionSort = async ({
  array,
  ms,
  updateSwap,
  updateLeftIndex,
  updateRightIndex,
  setHighlightedLines,
}: {
  array: number[];
  ms: number;
  updateSwap: (newArray: number[]) => void;
  updateLeftIndex: (index: number | null) => void;
  updateRightIndex: (index: number | null) => void;
  setHighlightedLines: (lines: number[]) => void;
}): Promise<number[]> => {
  let swapped;
  let sortedIndex = array.length;
  do {
    // Highlight "do"
    setHighlightedLines([0]);
    swapped = false;
    // Highlight "swapped = false" and "for loop"
    setHighlightedLines([1, 2]);
    for (let i = 1; i < sortedIndex; i++) {
      await visualizationDelay(ms);
      updateLeftIndex(i);
      updateRightIndex(i - 1);

      let j = i - 1;
      // Highlight "while left_element >=  0"
      setHighlightedLines([3]);
      while (j >= 0) {
        setHighlightedLines([4]);
        if (array[j] > array[j + 1]) {
          // Highlight "if condition"
          setHighlightedLines([5, 6]);
          await swap({
            array: array,
            a: j + 1,
            b: j,
            ms: ms,
            updateSwap: updateSwap,
            setHighlightedLines: setHighlightedLines,
          });
          swapped = true;
          j = j - 1;
          await visualizationDelay(ms);
          updateLeftIndex(j); // j might be -1
          updateRightIndex(j + 1);
        } else {
          j = j - 1;
        }
      }
      setHighlightedLines([7]);
      await visualizationDelay(ms);
    }
  } while (swapped);
  // Highlight "while condition"
  setHighlightedLines([6]);
  // Reset indices
  updateLeftIndex(null);
  updateRightIndex(null);
  await visualizationDelay(ms);
  // Reset highlights
  setHighlightedLines([]);
  // Return sorted array
  return array;
};
