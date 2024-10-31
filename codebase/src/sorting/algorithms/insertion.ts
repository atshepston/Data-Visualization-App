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
            // let key = array[i];
            // let j = i - 1;
    
            // /* Move elements of arr[0..i-1], that are
            //    greater than key, to one position ahead
            //    of their current position */
            // while (j >= 0 && array[j] > key) {
            //     array[j + 1] = array[j];
            //     j = j - 1;
            // }
            // array[j + 1] = key;
            let j = i - 1;
            while(j >= 0){
                if (array[j] > array[j+1]) {
                    // Highlight "if condition"
                    updateCurrentLines([3]);
                    await swap(array, j+1, j, delay, updateSwap, updateCurrentLines);
                    swapped = true;
                    j = j - 1;
                    updateLeftIndex(j); // j might be -1
                    updateRightIndex(j+1);
                }
            }
            // Visualization delay
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


