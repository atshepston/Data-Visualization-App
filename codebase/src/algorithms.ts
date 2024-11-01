import type { AdjacencyList } from "./graph/types";

/**
 *
 * @param graph in the form of an adjacency list
 * @param startNode is the id of the node from which the function starts the traversal
 * @returns an array of numbers consisting of the node ids in the order they were visited
 */
export function bfsWithTrace(graph: AdjacencyList, source: number): number[] {
  const visited: number[] = []; // Track visited nodes
  const queue: number[] = [source]; // Queue for BFS traversal

  while (queue.length > 0) {
    const curr = queue.shift()!; // Get the first node from the queue
    const alreadyVisited = visited.includes(curr); // Check if it's already visited

    if (alreadyVisited) continue;

    visited.push(curr); // Mark the node as visited

    // Traverse the edges of the current node to it's adjacent nodes
    const adjNodes = graph[curr];
    adjNodes.forEach((adjNode) => queue.push(adjNode));
  }
  return visited;
}

/**
 *
 * @param graph in the form of an adjacency list
 * @param startNode is the id of the node from which the function starts the traversal
 * @returns an array of numbers consisting of the node ids in the order they were visited
 * contains a helper function to recursively run the dfs algorithm on all children of a node
 */
export function dfsWithTrace(graph: AdjacencyList, source: string): number[] {
  const startNode = Number(source);
  const visited: number[] = []; // Track visited nodes

  function dfs(node: number): void {
    const alreadyVisited = visited.includes(node);

    if (alreadyVisited) {
      return;
    } // Stop recursion if already visited

    visited.push(node); // Mark as visited

    // Traverse to each node and run function recursively
    const adjNodes = graph[node];
    adjNodes.forEach((adjNode) => dfs(adjNode));
  }

  dfs(startNode); // Start DFS from the source node
  return visited;
}
