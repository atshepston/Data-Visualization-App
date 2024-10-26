import { test, expect } from "vitest";
import type { GNode, GEdge } from "./graph/types";
import { graphToAdjList, adjListToGraph } from "./converters";

function edgeConstructor(
  id: number,
  to: number,
  from: number,
  weight: number,
  type: any
): GEdge {
  return { id: id, to: to, from: from, weight: weight, type: type };
}
function nodeConstructor(id: number, x: number, y: number): GNode {
  return { id: id, x: x, y: y };
}

const node1 = nodeConstructor(1, 10, 10);
const node2 = nodeConstructor(2, 20, 20);
const node3 = nodeConstructor(3, 30, 30);
const node4 = nodeConstructor(4, 40, 40);
const node5 = nodeConstructor(5, 50, 50);

const edge1 = edgeConstructor(1, 2, 1, 1, "undirected");
const edge2 = edgeConstructor(2, 3, 2, 1, "undirected");
const edge3 = edgeConstructor(3, 4, 1, 1, "undirected");
const edge4 = edgeConstructor(4, 5, 4, 1, "undirected");

const nodes = [node1, node2, node3, node4, node5];
const edges = [edge1, edge2, edge3, edge4];

test("Test basic execution", () => {
  const result = graphToAdjList(nodes, edges);
  expect(result).toStrictEqual({
    "1": [2, 4],
    "2": [1, 3],
    "3": [2],
    "4": [1, 5],
    "5": [4],
  });
});

test("Testing both empty sets", () => {
  const result = graphToAdjList([], []);
  expect(result).toStrictEqual({});
});

test("Testing empty node set and random set of edges", () => {
  const result = graphToAdjList([], edges);
  expect(result).toStrictEqual({});
});

test("Testing empty edge set and random set of nodes", () => {
  const result = graphToAdjList(nodes, []);
  expect(result).toStrictEqual({ "1": [], "2": [], "3": [], "4": [], "5": [] });
});

test("Testing directed graph", () => {
  const edge1 = edgeConstructor(1, 2, 1, 1, "directed");
  const edge2 = edgeConstructor(2, 2, 3, 1, "directed");
  const edge3 = edgeConstructor(3, 4, 1, 1, "directed");
  const edge4 = edgeConstructor(4, 5, 4, 1, "directed");
  const edges = [edge1, edge2, edge3, edge4];

  const result = graphToAdjList(nodes, edges);
  const expected = { "1": [2, 4], "2": [], "3": [2], "4": [5], "5": [] };
  expect(result).toStrictEqual(expected);
});
