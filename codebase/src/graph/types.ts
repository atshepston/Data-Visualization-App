export type GNode = {
  // Representation of graph node
  id: number;
  x: number;
  y: number;
};

export type GEdge = {
  // Representation of graph edge
  id: number;
  to: number;
  from: number;
  weight: number;
  type: "directed" | "undirected";
};

export type AdjacencyList = Record<number, number[]>; // Adjacency list representation of graph
