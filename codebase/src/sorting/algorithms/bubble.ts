// Bubble sort algorithm
export function bubbleSort(arr: number[], n: number){
    //n is the length of the array
    let i, j, temp;
    let swapped;
    for (i = 0; i < n - 1; i++){
        swapped = false;
        for (j = 0; j < n - i - 1; j++){
            if (arr[j] > arr[j + 1]){
                // Swap arr[j] and arr[j+1]
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
                console.log("Swapped Index " + j + " with index " + (j+1));
            }
        }

        // IF no two elements were 
        // swapped by inner loop, then break
        if (swapped == false)
        break;
    }
    return arr;
}

// Function to print an array 
function printBubbleArray(arr: number[], size: number){
  let i;
  for (i = 0; i < size; i++)
      console.log(arr[i] + " ");
}

// Driver program
// var arr = [ 64, 34, 25, 12, 22, 11, 90 ];
// var n = arr.length;
// bubbleSort(arr, n);
// console.log("Sorted array: ");
// printArray(arr, n);
