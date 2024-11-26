import type { AdjacencyList } from "./graph/types";
import type { GNode, GEdge } from "./graph/types";

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
    const alreadyVisited = visited.includes(curr); // Check if it's already visited

    if (alreadyVisited) continue;

    trace.push([source, curr]);

    visited.push(curr); // Mark the node as visited

    // Traverse the edges of the current node to it's adjacent nodes
    const adjNodes = graph[curr].sort((a, b) => a - b);
    if (adjNodes) {
      adjNodes.forEach((adjNode) => queue.push([curr, adjNode]));
    }
  }
  return { trace, visited };
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
    const alreadyVisited = visited.includes(curr);

    if (alreadyVisited) {
      return;
    } // Stop recursion if already visited

    trace.push([source, curr]);

    visited.push(curr); // Mark as visited

    // Traverse to each node and run function recursively
    const adjNodes = graph[curr].sort((a, b) => a - b);
    if (adjNodes) adjNodes.forEach((adjNode) => dfs([curr, adjNode]));
  }

  dfs(startNode); // Start DFS from the source node
  return { trace, visited };
}

//TODO: Dijkstra's
export function dijkstraWithTrace(
  nodes: GNode[],
  edges: GEdge[],
  startNodeId: GNode["id"]
) {
  const distances: { [nodeId: GNode["id"]]: number } = {};
  const visited: GNode["id"][] = [];
  const priorityQueue: [GNode["id"], number][] = [];
  let trace: [GNode["id"] | null, GNode["id"], number, number][] = [];

  // Initialize distances to Infinity, except the start node
  nodes.forEach((node) => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
  });
  trace.push([null, startNodeId, 0, 0]);

  // Add the start node to the priority queue
  priorityQueue.push([startNodeId, 0]);

  // Helper function to extract the node with the smallest distance
  const shortestDistance = (): [GNode["id"], number] | undefined => {
    let minIndex = 0;
    for (let i = 1; i < priorityQueue.length; i++) {
      if (priorityQueue[i][1] < priorityQueue[minIndex][1]) {
        minIndex = i;
      }
    }
    return priorityQueue.splice(minIndex, 1)[0];
  };

  // Main loop
  while (priorityQueue.length > 0) {
    const [currentNode, currentDistance] = shortestDistance()!;

    if (visited.includes(currentNode)) continue;
    visited.push(currentNode);

    // Update distances for all neighbors
    const neighbors = edges.filter((edge) => edge.from === currentNode);
    for (const edge of neighbors) {
      const neighbor = edge.to;
      if (!visited.includes(neighbor)) {
        const newDistance = currentDistance + edge.weight;
        if (newDistance < distances[neighbor]) {
          const oldDistance = distances[neighbor];
          distances[neighbor] = newDistance;
          priorityQueue.push([neighbor, newDistance]);
          trace.push([edge.from, edge.to, oldDistance, newDistance]);
        } else {
          trace.push([
            currentNode,
            edge.to,
            distances[neighbor],
            distances[neighbor],
          ]);
        }
      }
    }
  }

  return { trace, distances };
}
