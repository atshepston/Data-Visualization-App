import { test, expect } from "vitest";
import { bfsWithTrace, dfsWithTrace } from "./algorithms";

test("Basic bfs execution", () => {
  const adjList = { "1": [2, 4], "2": [1, 3], "3": [2], "4": [1, 5], "5": [4] };
  const result = bfsWithTrace(adjList, 1);
  const expected = [1, 2, 4, 3, 5];
  expect(result).toStrictEqual(expected);
});

test("Test bfs on a single node with no neighbors", () => {
  const adjList = { "1": [], "2": [1, 3], "3": [2], "4": [1, 5], "5": [4] };
  const result = bfsWithTrace(adjList, 1);
  const expected = [1];
  expect(result).toStrictEqual(expected);
});

test("Test bfs on a loop", () => {
  const adjList = {
    "1": [2, 4, 5],
    "2": [1, 3],
    "3": [2],
    "4": [1, 5],
    "5": [1, 4],
  };
  const result = bfsWithTrace(adjList, 1);
  const expected = [1, 2, 4, 5, 3];
  expect(result).toStrictEqual(expected);
});

test("Basic dfs execution", () => {
  const adjList = { "1": [2, 4], "2": [1, 3], "3": [2], "4": [1, 5], "5": [4] };
  const result = dfsWithTrace(adjList, "1");
  const expected = [1, 2, 3, 4, 5];
  expect(result).toStrictEqual(expected);
});

test("Test dfs on a single node with no neighbors", () => {
  const adjList = { "1": [], "2": [1, 3], "3": [2], "4": [1, 5], "5": [4] };
  const result = dfsWithTrace(adjList, "1");
  const expected = [1];
  expect(result).toStrictEqual(expected);
});

test("Test dfs on a loop", () => {
  const adjList = {
    "1": [2, 4, 5],
    "2": [1, 3],
    "3": [2],
    "4": [1, 5],
    "5": [1, 4],
  };
  const result = dfsWithTrace(adjList, "1");
  const expected = [1, 2, 3, 4, 5];
  expect(result).toStrictEqual(expected);
});
