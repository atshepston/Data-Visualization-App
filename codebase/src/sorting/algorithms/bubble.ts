export const bubbleSort = async ({
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
  let swapped;
  let sortedIndex = array.length;
  do {
    // Highlight "do"
    setHighlightedLines([0]);
    swapped = false;
    // Highlight "swapped = false" and "for loop"
    setHighlightedLines([1, 2]);
    for (let i = 0; i < sortedIndex - 1; i++) {
      await visualizationDelay(ms);
      updateLeftIndex(i);
      updateRightIndex(i + 1);
      if (array[i] > array[i + 1]) {
        // Highlight "if condition"
        setHighlightedLines([3]);
        await swap({
          array: array,
          a: i,
          b: i + 1,
          ms: ms,
          updateSwap: updateSwap,
          setHighlightedLines: setHighlightedLines,
        });
        swapped = true;
      }
      await visualizationDelay(ms);
    }
    sortedIndex--;
    setHighlightedLines([6]);
    updateSortedIndex(sortedIndex);
    await visualizationDelay(ms);
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

export const swap = ({
  array,
  a,
  b,
  ms,
  updateSwap,
  setHighlightedLines,
}: {
  array: number[];
  a: number;
  b: number;
  ms: number;
  updateSwap: (newArray: number[]) => void;
  setHighlightedLines: (lines: number[]) => void;
}) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // Highlight "swap"
      setHighlightedLines([4, 5]);
      // Swap elements
      [array[a], array[b]] = [array[b], array[a]];
      updateSwap([...array]);
      resolve();
    }, ms);
  });
};

export const visualizationDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
