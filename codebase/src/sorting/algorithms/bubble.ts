// // Bubble sort algorithm
// export function bubbleSort(arr: number[], n: number){
//     //n is the length of the array
//     let i, j, temp;
//     let swapped;
//     for (i = 0; i < n - 1; i++){
//         swapped = false;
//         for (j = 0; j < n - i - 1; j++){
//             if (arr[j] > arr[j + 1]){
//                 // Swap arr[j] and arr[j+1]
//                 temp = arr[j];
//                 arr[j] = arr[j + 1];
//                 arr[j + 1] = temp;
//                 swapped = true;
//                 console.log("Swapped Index " + j + " with index " + (j+1));
//             }
//         }

//         // IF no two elements were 
//         // swapped by inner loop, then break
//         if (swapped == false)
//         break;
//     }
//     return arr;
// }

// // Function to print an array 
// function printBubbleArray(arr: number[], size: number){
//   let i;
//   for (i = 0; i < size; i++)
//       console.log(arr[i] + " ");
// }

// // Driver program
// // var arr = [ 64, 34, 25, 12, 22, 11, 90 ];
// // var n = arr.length;
// // bubbleSort(arr, n);
// // console.log("Sorted array: ");
// // printArray(arr, n);


// // Bubble sort algorithm

//array is the user inputted array
//positions represents the location of each inputted element in the array
//delay is how long the swap animation should take
//updateSwap updates the array and position arrays
export const bubbleSort = async (
    array: number[],
    positions: number[],
    delay: number,
    updateSwap: (newArray: number[], newPositions: number[], posHasChanged: boolean) => void,
    //updatePositionSwap: (newPositions: number[]) => void,
    //updateArraySwap: (newArray: number[]) => void,
): Promise<number[]> => {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                // perform the swap
                await swap(array, positions, j, j + 1, delay, updateSwap);
            }
        }
    }
    return array; // return sorted array
};

const swap = (
    array: number[],
    positions: number[],
    a: number,
    b: number,
    delay: number,
    updateSwap: (newArray: number[], newPositions: number[], posHasChanged: boolean) => void,
    // updatePositionSwap: (newPositions: number[]) => void,
    // updateArraySwap: (newArray: number[]) => void,
) => {
    return new Promise<void>((resolve) => {
        // first swap elements in the positions array 
        // will cause the animations to trigger
        console.log("0. array: " + array + " and positions: " + positions);
        const tempPos = positions[a];
        positions[a] = positions[b];
        positions[b] = tempPos;

        // update the array and positions to trigger animation
        updateSwap([...array], [...positions], true);
        console.log("1. array: " + array + " and positions: " + positions);

        setTimeout(() => {
            // after animation, update data in actual array
            const temp = array[a];
            array[a] = array[b];
            array[b] = temp;

            // update the array and positions arrays
            // only "array" array has been changed
            // will NOT trigger animation because positions array has already been updated
            updateSwap([...array], positions, false);
            console.log("2. array: " + array + " and positions: " + positions);

            resolve();
        }, delay);
    });
};