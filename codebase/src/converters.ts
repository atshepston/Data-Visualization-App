import type { AdjacencyList, GNode, GEdge } from "./graph/types";

/**
 * 
 * @param nodes array of nodes from a graph
 * @param edges array of edges from a graph
 * @returns an Adjacency List constructed with the given arrays
 */
export function graphToAdjList(nodes: GNode[], edges: GEdge[]): AdjacencyList {
     return nodes.reduce<AdjacencyList>((acc, node) => {
        acc[Number(node.label)] = edges.filter(edge => {
        return edge.type === 'undirected' ? Number(edge.from) === Number(node.label) ||
        Number(edge.to) === Number(node.label) :
        Number(edge.from) === Number(node.label)
     }).map(edge => {
        if(edge.type === 'undirected'){
            return Number(edge.from) === Number(node.label) ?
            Number(edge.to) : Number(edge.from)
        }
        return Number(edge.to)
     });
    return acc; }, {});
}

/**
 * 
 * @param adjList a previously constructed Adjacency List
 * @returns an object containing an array of edges and an array of nodes given adjList
 */
export function adjListToGraph(adjList: AdjacencyList): Object {
    const nodes = Object.keys(adjList).map((label) => ({label: label} as GNode))
    const edges = Object.entries(adjList).flatMap(([from, tos]) =>
        tos.map(to => ({ from: from.toString(), to: to.toString() }))
      );

    return {nodes, edges}
}