import { test, expect } from 'vitest' 
import type { GNode, GEdge } from './graph/types'
import { bfsWithTrace, dfsWithTrace } from './algorithms'
import { rmSync } from 'fs';


test("Basic execution", () => {
    const adjList = { '1': [ 2, 4 ], '2': [ 1, 3 ], '3': [ 2 ], '4': [ 1, 5 ], '5': [ 4 ] }
    
    const result = bfsWithTrace(adjList, '1');
    
    console.log(result)

    const expected = new Set<number>();
    expected.add(1).add(2).add(4).add(3).add(5);
    expect(result).toStrictEqual(expected)
});

test("Test on a single node with no neighbors", () => {
    const adjList = { '1': [], '2': [ 1, 3 ], '3': [ 2 ], '4': [ 1, 5 ], '5': [ 4 ] }
    const result = bfsWithTrace(adjList, '1');
    const expected = new Set<number>();
    expected.add(1);
    expect(result).toStrictEqual(expected);
})
