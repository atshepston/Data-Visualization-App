export const bubbleSort = async ({
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
    // Highlight "do"
    updateCurrentLines([0]);
    swapped = false;
    // Highlight "swapped = false" and "for loop"
    updateCurrentLines([1, 2]);
    for (let i = 0; i < sortedIndex - 1; i++) {
      // Visualization delay
      await delay(ms);
      updateLeftIndex(i);
      updateRightIndex(i + 1);
      if (array[i] > array[i + 1]) {
        // Highlight "if condition"
        updateCurrentLines([3]);
        await swap(array, i, i + 1, ms, updateSwap, updateCurrentLines);
        swapped = true;
      }
      // Visualization delay
      await delay(ms);
    }
    // Decrease sorted index
    sortedIndex--;
    updateCurrentLines([6]);
    // Update sorted index
    updateSortedIndex(sortedIndex);
    // Visualization delay
    await delay(ms);
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

export const swap = (
  array: number[],
  a: number,
  b: number,
  ms: number,
  updateSwap: (newArray: number[]) => void,
  updateCurrentLines: (lines: number[]) => void
) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // Highlight "swap"
      updateCurrentLines([4, 5]);
      // Swap elements
      [array[a], array[b]] = [array[b], array[a]];
      updateSwap([...array]);
      resolve();
    }, ms);
  });
};

export const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
