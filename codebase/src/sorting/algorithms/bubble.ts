// // Bubble sort algorithm

//array is the user inputted array
//delay is how long the swap animation should take
//updateSwap updates the array
export const bubbleSort = async (
    array: number[],
    delay: number,
    updateSwap: (newArray: number[]) => void,
    updateInnerIndex: (index: number | null) => void
): Promise<number[]> => {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            //updateInnerIndex will highlight the bar being shifted to the right
            updateInnerIndex(j);  // set the outer index (for visualization purposes)
            if (array[j] > array[j + 1]) {
                // perform the swap
                await swap(array, j, j + 1, delay, updateSwap);
            }
        }
    }
    updateInnerIndex(null);  // reset after sorting
    return array; // return sorted array
};

const swap = (
    array: number[],
    a: number,
    b: number,
    delay: number,
    updateSwap: (newArray: number[]) => void,
) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            // update array
            const temp = array[a];
            array[a] = array[b];
            array[b] = temp;

            updateSwap([...array]);
            console.log("2. array: " + array);

            resolve();
        }, delay);
    });
};