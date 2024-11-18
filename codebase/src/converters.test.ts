import { test, expect } from "vitest";
import type { GNode, GEdge } from "./graph/types";
import { graphToAdjList } from "./converters";

const node1: GNode = { id: 1, x: 10, y: 10, status: "default" };
const node2: GNode = { id: 2, x: 20, y: 20, status: "default" };
const node3: GNode = { id: 3, x: 30, y: 30, status: "default" };
const node4: GNode = { id: 4, x: 40, y: 40, status: "default" };
const node5: GNode = { id: 5, x: 50, y: 50, status: "default" };

const edge1 = { id: 1, to: 2, from: 1, weight: 1, type: "undirected" };
const edge2 = { id: 2, to: 3, from: 2, weight: 1, type: "undirected" };
const edge3 = { id: 3, to: 4, from: 1, weight: 1, type: "undirected" };
const edge4 = { id: 4, to: 5, from: 4, weight: 1, type: "undirected" };

const nodes = [node1, node2, node3, node4, node5];
const edges = [edge1, edge2, edge3, edge4] as GEdge[];

test("Basic execution of conversion from nodes and edges to adjacency list", () => {
  const result = graphToAdjList(nodes, edges);
  expect(result).toStrictEqual({
    "1": [2, 4],
    "2": [1, 3],
    "3": [2],
    "4": [1, 5],
    "5": [4],
  });
});

test("No nodes and edges should return empty adjacency list", () => {
  const result = graphToAdjList([], []);
  expect(result).toStrictEqual({});
});

test("No nodes and random set of edges should return empty adjacency list", () => {
  const result = graphToAdjList([], edges);
  expect(result).toStrictEqual({});
});

test("No edges and random set of nodes should return empty arrays for all nodes in adjList", () => {
  const result = graphToAdjList(nodes, []);
  expect(result).toStrictEqual({ "1": [], "2": [], "3": [], "4": [], "5": [] });
});

test("Basic execution of conversion from nodes and edges to adjacency list with directed edges", () => {
  const edge1 = { id: 1, to: 2, from: 1, weight: 1, type: "directed" };
  const edge2 = { id: 2, to: 2, from: 3, weight: 1, type: "directed" };
  const edge3 = { id: 3, to: 4, from: 1, weight: 1, type: "directed" };
  const edge4 = { id: 4, to: 5, from: 4, weight: 1, type: "directed" };
  const edges = [edge1, edge2, edge3, edge4] as GEdge[];

  const result = graphToAdjList(nodes, edges);
  const expected = { "1": [2, 4], "2": [], "3": [2], "4": [5], "5": [] };
  expect(result).toStrictEqual(expected);
});
