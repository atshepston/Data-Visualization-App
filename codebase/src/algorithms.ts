import type { AdjacencyList } from "./graph/types";

/**
 *
 * @param graph in the form of an adjacency list
 * @param startNode is the id of the node from which the function starts the traversal
 * @returns an array of numbers consisting of the node ids in the order they were visited
 */
export function bfsWithTrace(graph: AdjacencyList, source: number) {
  const visited: number[] = []; // Track visited nodes
  let queue: [number | null, number][];
  queue = [[null, source]]; // Queue for BFS traversal
  const trace = [];

  while (queue.length > 0) {
    const [source, curr] = queue.shift()!; // Get the first node from the queue
    trace.push([source, curr]);
    const alreadyVisited = visited.includes(curr); // Check if it's already visited

    if (alreadyVisited) continue;

    visited.push(curr); // Mark the node as visited

    // Traverse the edges of the current node to it's adjacent nodes
    const adjNodes = graph[curr];
    adjNodes.forEach((adjNode) => queue.push([curr, adjNode]));
  }
  return trace;
}

/**
 *
 * @param graph in the form of an adjacency list
 * @param startNode is the id of the node from which the function starts the traversal
 * @returns an array of numbers consisting of the node ids in the order they were visited
 * contains a helper function to recursively run the dfs algorithm on all children of a node
 */
export function dfsWithTrace(graph: AdjacencyList, source: number) {
  const visited: number[] = []; // Track visited nodes
  let trace: [number | null, number][] = [];
  const startNode: [number | null, number] = [null, source];
  function dfs(nodes: [number | null, number]): void {
    let [source, curr] = nodes;
    trace.push([source, curr]);
    const alreadyVisited = visited.includes(curr);

    if (alreadyVisited) {
      return;
    } // Stop recursion if already visited

    visited.push(curr); // Mark as visited

    // Traverse to each node and run function recursively
    const adjNodes = graph[curr];
    adjNodes.forEach((adjNode) => dfs([curr, adjNode]));
  }

  dfs(startNode); // Start DFS from the source node
  return trace;
}
