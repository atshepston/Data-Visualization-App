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

export enum Status {
  default = "green",
  selected = "red",
  explored = "gray",
  exploring = "yellow",
}
export type AdjacencyList = Record<number, number[]>; // Adjacency list representation of graph
