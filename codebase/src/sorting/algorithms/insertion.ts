import { swap, delayExecution } from "./bubble";

// Function to sort array using insertion sort
export const insertionSort = async (
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
        for (let i = 1; i < sortedIndex; i++) {
            // Visualization delay
            await delayExecution(delay);
            updateLeftIndex(i);
            updateRightIndex(i - 1);

            let j = i - 1;
            // Highlight "while left_element >=  0"
            updateCurrentLines([3]);
            while(j >= 0){
                updateCurrentLines([4]);
                if (array[j] > array[j+1]) {
                    // Highlight "if condition"
                    updateCurrentLines([5, 6]);
                    await swap(array, j+1, j, delay, updateSwap, updateCurrentLines);
                    swapped = true;
                    j = j - 1;
                    await delayExecution(delay);
                    updateLeftIndex(j); // j might be -1
                    updateRightIndex(j+1);
                }
                else{
                    j = j - 1;
                }
            }
            // Visualization delay
            updateCurrentLines([7]);
            await delayExecution(delay);
        }
    } while(swapped);
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
}


