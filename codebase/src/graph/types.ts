import { getCurrentInstance } from "vue";

export type GNode = {
  // Representation of graph node
  id: number;
  x: number;
  y: number;
  status: Status;
};

export type GEdge = {
  // Representation of graph edge
  id: number;
  to: number;
  from: number;
  weight: number;
  type: "directed" | "undirected";
  status: Status;
};

export const STATUS_TO_COLOR = {
  default: "green",
  selected: "red",
  explored: "gray",
  exploring: "yellow",
} as const;

export type Status = keyof typeof STATUS_TO_COLOR;

export type AdjacencyList = Record<number, number[]>; // Adjacency list representation of graph
