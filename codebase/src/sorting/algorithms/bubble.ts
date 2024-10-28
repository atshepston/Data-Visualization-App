export const bubbleSort = async (
    array: number[],
    delay: number,
    updateSwap: (newArray: number[]) => void,
    updateLeftIndex: (index: number | null) => void,
    updateRightIndex: (index: number | null) => void,
    updateCurrentLines: (lines: number[]) => void,
    updateSortedIndex: (index: number | null) => void // Add this parameter
): Promise<number[]> => {
    let swapped;
    let sortedIndex = array.length; // Track the sorted elements
    do {
        updateCurrentLines([0]); // Highlight "do"
        swapped = false;
        updateCurrentLines([1, 2]); // Highlight "swapped = false" and "for i = 1 to indexOfLastUnsortedElement-1"
        for (let i = 0; i < sortedIndex - 1; i++) {
            await delayExecution(delay); // Add delay for visualization
            if (array[i] > array[i + 1]) {
                updateCurrentLines([3]); // Highlight "if leftElement > rightElement"
                updateLeftIndex(i);
                updateRightIndex(i + 1);
                await swap(array, i, i + 1, delay, updateSwap, updateCurrentLines);
                updateCurrentLines([4, 5]); // Highlight "swap(leftElement, rightElement)" and "swapped = true;"
                swapped = true;
                await delayExecution(delay); // Add delay for visualization
            } else {
                updateCurrentLines([3]); // Highlight "if leftElement > rightElement"
                updateLeftIndex(i);
                updateRightIndex(i + 1);
                await delayExecution(delay); // Add delay for visualization
            }
            await delayExecution(delay); // Add delay for visualization
        }
        sortedIndex--; // Decrease the sorted index
        updateSortedIndex(sortedIndex); // Update the sorted index
        await delayExecution(delay); // Add delay for visualization
    } while (swapped);
    updateCurrentLines([6]); // Highlight "while swapped"
    updateLeftIndex(null);   // reset after sorting
    updateRightIndex(null);  // reset after sorting
    await delayExecution(delay); // Add delay for visualization
    updateCurrentLines([]); // reset after sorting
    return array; // return sorted array
};

const swap = (
    array: number[],
    a: number,
    b: number,
    delay: number,
    updateSwap: (newArray: number[]) => void,
    updateCurrentLines: (lines: number[]) => void
) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            updateCurrentLines([4]); // Highlight "swap(leftElement, rightElement)"
            // update array
            [array[a], array[b]] = [array[b], array[a]];

            updateSwap([...array]);

            resolve();
        }, delay);
    });
};

const delayExecution = (delay: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, delay);
    });
};
