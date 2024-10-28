export const bubbleSort = async (
    array: number[],
    delay: number,
    updateSwap: (newArray: number[]) => void,
    updateLeftIndex: (index: number | null) => void,
    updateRightIndex: (index: number | null) => void,
    updateCurrentLines: (lines: number[]) => void,
    updateSortedIndex: (index: number | null) => void
): Promise<number[]> => {
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
            await delayExecution(delay);
            updateLeftIndex(i);
            updateRightIndex(i + 1);
            if (array[i] > array[i + 1]) {
                // Highlight "if condition"
                updateCurrentLines([3]);
                await swap(array, i, i + 1, delay, updateSwap, updateCurrentLines);
                swapped = true;
            }
            // Visualization delay
            await delayExecution(delay);
        }
        // Decrease sorted index
        sortedIndex--;
        // Update sorted index
        updateSortedIndex(sortedIndex);
        // Visualization delay
        await delayExecution(delay);
    } while (swapped);
    // Highlight "while condition"
    updateCurrentLines([6]);
    // Reset indices
    updateLeftIndex(null);
    updateRightIndex(null);
    // Visualization delay
    await delayExecution(delay);
    // Reset highlights
    updateCurrentLines([]);
    // Return sorted array
    return array;
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
            // Highlight "swap"
            updateCurrentLines([4]);
            // Swap elements
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
