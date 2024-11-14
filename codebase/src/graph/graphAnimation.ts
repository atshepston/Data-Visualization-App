import { type GNode, type GEdge } from "./types";
import { delay } from "@/sorting/algorithms/bubble";
import { drawEdges } from "@/components/edge";
import { drawNodes } from "@/components/node";

export const animateGraph = async (
  nodes: GNode[],
  edges: GEdge[],
  trace: (number | null)[][],
  ctx: CanvasRenderingContext2D,
  r: number
) => {
  let firstNode;
  for (let i = 0; i < trace.length; ++i) {
    let [source, destination] = trace[i];
    let currNode: GNode = {} as GNode;
    let nextNode: GNode = {} as GNode;
    for (const node of nodes) {
      if (node.id === destination) {
        nextNode = node;
        if (!firstNode) firstNode = nextNode;
      }
      if (node.id === source) {
        currNode = node;
      }
    }
    if (trace.length == 1) {
      nextNode.status = "exploring";
    }
    currNode!.status = "exploring";
    // Color destination and draw graph
    drawEdges(ctx, nodes, edges);
    drawNodes(ctx, nodes, r);
    await delay(1000);

    const edge = edges.find(
      (e) =>
        (e.from === source && e.to === destination) ||
        (e.from === destination && e.to === source)
    );

    if (edge) {
      edge.status = "exploring";
      nextNode!.status = "exploring";
      // Update edge and next node. Draw graph
      drawEdges(ctx, nodes, edges);
      drawNodes(ctx, nodes, r);
      await delay(1000);
      currNode!.status = "explored";
      nextNode!.status = "explored";
      edge.status = "explored";
      // Mark edge and nodes as explored after visual update
      //   drawEdges(ctx, nodes, edges);
      //   drawNodes(ctx, nodes, r);
      //   await delay(1000);
    }
  }

  edges.forEach((edge) => {
    edge.status = "default";
  });
  nodes.forEach((node) => {
    node.status = "default";
  });
  firstNode!.status = "selected";
  drawEdges(ctx, nodes, edges);
  drawNodes(ctx, nodes, r);
};
