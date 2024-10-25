export type GNode = { // Representation of graph node
    id: string
    label: string
    x: number
    y: number
};

export type GEdge = { // Representation of graph edge
    id: string
    to: string
    from: string
    weight: number
    type: 'directed' | 'undirected'
}

export type AdjacencyList = Record<number, number[]>;  // Adjacency list representation of graph