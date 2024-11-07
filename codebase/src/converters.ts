import type { AdjacencyList, GNode, GEdge } from "./graph/types";

/**
 *
 * @param nodes array of nodes from a graph
 * @param edges array of edges from a graph
 * @returns an Adjacency List constructed with the given arrays
 */
export function graphToAdjList(nodes: GNode[], edges: GEdge[]): AdjacencyList {
  return nodes.reduce<AdjacencyList>((acc, node) => {
    acc[node.id] = edges
      .filter((edge) => {
        return edge.type === "undirected"
          ? edge.from === node.id || edge.to === node.id
          : edge.from === node.id;
      })
      .map((edge) => {
        if (edge.type === "undirected") {
          return edge.from === node.id ? edge.to : edge.from;
        }
        return edge.to;
      });
    return acc;
  }, {});
}

/**
 *
 * @param adjList a previously constructed Adjacency List
 * @returns an object containing an array of edges and an array of nodes given adjList
 */
export function adjListToGraph(adjList: AdjacencyList): {
  nodes: GNode[];
  edges: GEdge[];
} {
  const nodes = Object.keys(adjList).map((id) => ({ id: Number(id) } as GNode));
  const edges = Object.entries(adjList).flatMap(([from, tos]) =>
    tos.map((to) => ({ from: Number(from), to: to } as GEdge))
  );

  return { nodes, edges };
}
