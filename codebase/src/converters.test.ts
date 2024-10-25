import { test, expect } from 'vitest' 
import type { GNode, GEdge } from './graph/types'
import { graphToAdjList, adjListToGraph } from './converters';
import exp from 'constants';


function edgeConstructor(id: string, to: string, from: string, weight: number, type: any): GEdge {
    return { id: id, to: to, from: from, weight: weight, type: type }
}
function nodeConstructor(id: string, label: string, x: number, y: number): GNode {
    return { id: id, label: label, x: x, y: y }
}
    test("Basic conversion", () => {
        const n1: GNode = {
            id: '1',
            label: '1',
            x: 10,
            y: 10
        }
        const n2: GNode = {
            id: '2',
            label: '2',
            x: 20,
            y: 20
        }
        const n3: GNode = {
            id: '3',
            label: '3',
            x: 30,
            y: 30
        }
        const n4: GNode = {
            id: '4',
            label: '4',
            x: 40,
            y: 40
        }
        const n5: GNode = {
            id: '5',
            label: '5',
            x: 50,
            y: 50
        }
        const nodes = [n1, n2, n3, n4, n5];
        
        const edge1 = edgeConstructor('1', '2', '1', 1, 'undirected');
        const edge2 = edgeConstructor('2', '3', '2', 1, 'undirected');
        const edge3 = edgeConstructor('3', '4', '1', 1, 'undirected');
        const edge4 = edgeConstructor('4', '5', '4', 1, 'undirected');

        const edges = [edge1, edge2, edge3, edge4];

        const result = graphToAdjList(nodes, edges);
        console.log(result)
        expect(result).toStrictEqual({ '1': [2, 4], '2': [1, 3], '3': [2], '4': [1, 5], '5': [4]})
    });

    test("Testing both empty sets", () => {
    const result = graphToAdjList([], []);
    expect(result).toStrictEqual({})
    })

    test("Testing empty node set and random set of edges", () => {
        const edge1 = edgeConstructor('1', '2', '1', 1, 'undirected');
        const edge2 = edgeConstructor('2', '3', '2', 1, 'undirected');
        const edge3 = edgeConstructor('3', '4', '1', 1, 'undirected');
        const edge4 = edgeConstructor('4', '5', '4', 1, 'undirected');

        const edges = [edge1, edge2, edge3, edge4];
        const result = graphToAdjList([], edges);

        expect(result).toStrictEqual({})
    });

    test("Testing empty edge set and random set of nodes", () => {
        const node1 = nodeConstructor('1', '1', 10, 10);
        const node2 = nodeConstructor('2', '2', 20, 20);
        const node3 = nodeConstructor('3', '3', 30, 30);
        const node4 = nodeConstructor('4', '4', 40, 40);
        const node5 = nodeConstructor('5', '5', 50, 50);
        
        const nodes = [node1, node2, node3, node4, node5];
        const result = graphToAdjList(nodes, []);

        expect(result).toStrictEqual({'1': [], '2': [], '3': [], '4': [], '5': []})
    })

    test("Testing directed graph", () => {
        const node1 = nodeConstructor('1', '1', 10, 10);
        const node2 = nodeConstructor('2', '2', 20, 20);
        const node3 = nodeConstructor('3', '3', 30, 30);
        const node4 = nodeConstructor('4', '4', 40, 40);
        const node5 = nodeConstructor('5', '5', 50, 50);
        
        const edge1 = edgeConstructor('1', '2', '1', 1, 'directed');
        const edge2 = edgeConstructor('2', '2', '3', 1, 'directed');
        const edge3 = edgeConstructor('3', '4', '1', 1, 'directed');
        const edge4 = edgeConstructor('4', '5', '4', 1, 'directed');

        const nodes = [node1, node2, node3, node4, node5];
        const edges = [edge1, edge2, edge3, edge4];

        const result = graphToAdjList(nodes, edges);
        const expected = { '1': [2, 4], '2': [], '3': [2], '4': [5], '5': []}
        
        console.log(result);
        expect(result).toStrictEqual(expected);

    })
    /**
     * Tests for adjacency list to nodes and edges converter
     */

    test("Test adjToGraph for basic implementation", () => {
        const adjList = { '1': [2, 4], '2': [1, 3], '3': [2], '4': [1, 5], '5': [4]}

        const result = adjListToGraph(adjList);

        console.log(result)
    })