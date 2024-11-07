import { type GNode, type GEdge, type AdjacencyList, Status } from "./types";

const animateGraph = (nodes: GNode[], edges: GEdge[], trace: number[][]) => {
  for (let i = 0; i < trace.length; ++i) {
    let [source, destination] = trace[i];
    let currNode: GNode = {} as GNode;
    let nextNode: GNode = {} as GNode;
    for (const node of nodes) {
      if (node.id === destination) {
        nextNode = node;
      }
      if (node.id === source) {
        currNode = node;
      }
    }
    currNode!.status = Status.exploring;
    // Color destination and draw graph

    const edge = edges.find(
      (e) =>
        (e.from === source && e.to === destination) ||
        (e.from === destination && e.to === source)
    );

    if (edge) {
      edge.status = Status.exploring;
      nextNode!.status = Status.exploring;
      // Update edge and next node. Draw graph
      currNode!.status = Status.explored;
      nextNode!.status = Status.explored;
      edge.status = Status.explored;
      // Mark edge and nodes as explored after visual update
    }
  }
};
