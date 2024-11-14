import { test, expect } from "vitest";
import { bfsWithTrace, dfsWithTrace } from "./algorithms";
import { graphToAdjList } from "./converters";
import { Status } from "./graph/types";
import type { GEdge } from "./graph/types";

test("Basic bfs execution", () => {
  const adjList = { 1: [2, 3], 2: [1, 3, 4], 3: [1, 2], 4: [2] };

  const node1 = { id: 1, x: 10, y: 10, status: Status.default };
  const node2 = { id: 2, x: 20, y: 20, status: Status.default };
  const node3 = { id: 3, x: 30, y: 30, status: Status.default };
  const node4 = { id: 4, x: 40, y: 40, status: Status.default };

  const edge1 = { id: 1, to: 2, from: 1, weight: 1, type: "undirected" };
  const edge2 = { id: 2, to: 3, from: 2, weight: 1, type: "undirected" };
  const edge3 = { id: 3, to: 3, from: 1, weight: 1, type: "undirected" };
  const edge4 = { id: 4, to: 4, from: 2, weight: 1, type: "undirected" };

  const nodes = [node1, node2, node3, node4];
  const edges = [edge1, edge2, edge3, edge4] as GEdge[];

  const trace = graphToAdjList(nodes, edges);
  const result = bfsWithTrace(adjList, 1);

  const expected = [
    [null, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 3],
    [2, 4],
    [3, 1],
    [3, 2],
    [4, 2],
  ];
  expect(result).toStrictEqual(expected);
});

// test("Test bfs on a single node with no neighbors", () => {
//   const adjList = { 1: [], 2: [1, 3], 3: [2], 4: [1, 5], 5: [4] };
//   const result = bfsWithTrace(adjList, 1);
//   const expected = [1];
//   expect(result).toStrictEqual(expected);
// });

// test("Test bfs on a loop", () => {
//   const adjList = {
//     1: [2, 4, 5],
//     2: [1, 3],
//     3: [2],
//     4: [1, 5],
//     5: [1, 4],
//   };
//   const result = bfsWithTrace(adjList, 1);
//   const expected = [1, 2, 4, 5, 3];
//   expect(result).toStrictEqual(expected);
// });

// test("Basic dfs execution", () => {
//   const adjList = { 1: [2, 4], 2: [1, 3], 3: [2], 4: [1, 5], 5: [4] };
//   const result = dfsWithTrace(adjList, 1);
//   const expected = [1, 2, 3, 4, 5];
//   expect(result).toStrictEqual(expected);
// });

// test("Test dfs on a single node with no neighbors", () => {
//   const adjList = { 1: [], 2: [1, 3], 3: [2], 4: [1, 5], 5: [4] };
//   const result = dfsWithTrace(adjList, 1);
//   const expected = [1];
//   expect(result).toStrictEqual(expected);
// });

// test("Test dfs on a loop", () => {
//   const adjList = {
//     1: [2, 4, 5],
//     2: [1, 3],
//     3: [2],
//     4: [1, 5],
//     5: [1, 4],
//   };
//   const result = dfsWithTrace(adjList, 1);
//   const expected = [1, 2, 3, 4, 5];
//   expect(result).toStrictEqual(expected);
// });
