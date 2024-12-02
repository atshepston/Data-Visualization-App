import { type GNode, type GEdge } from "./types";
import { visualizationDelay } from "@/sorting/algorithms/bubble";
import { drawEdges } from "@/components/edge";
import { drawNodes } from "@/components/node";

export const animateBFSandDFS = async (
  nodes: GNode[],
  edges: GEdge[],
  trace: (GNode["id"] | null)[][],
  ctx: CanvasRenderingContext2D,
  nodeRadius: number,
  delayDuration: number
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
    drawNodes(nodes, {
      nodeRadius,
      ctx,
    });

    await visualizationDelay(delayDuration * 1000);

    const edge = edges.find(
      (e) =>
        (e.from === source && e.to === destination) ||
        (e.from === destination && e.to === source)
    );

    if (edge) {
      edge.status = "exploring";
      if (nextNode) nextNode.status = "exploring";
      // Update edge and next node. Draw graph
      drawEdges(ctx, nodes, edges);
      drawNodes(nodes, {
        nodeRadius,
        ctx,
      });

      await visualizationDelay(delayDuration * 1000);
      if (currNode) currNode.status = "explored";
      if (nextNode) nextNode.status = "explored";
      edge.status = "explored";
      // Mark edge and nodes as explored after visual update
      //   drawEdges(ctx, nodes, edges);
      //   drawNodes(ctx, nodes, r);
      //   await delay(speed);
    }
  }

  edges.forEach((edge) => (edge.status = "default"));
  nodes.forEach((node) => (node.status = "default"));

  if (!firstNode) throw "first node must be defined in animateGraph";
  firstNode.status = "selected";

  drawEdges(ctx, nodes, edges);
  drawNodes(nodes, {
    nodeRadius,
    ctx,
  });
};

export const animateDijkstras = async (
  nodes: GNode[],
  edges: GEdge[],
  trace: [GNode["id"] | null, GNode["id"], number, number][],
  ctx: CanvasRenderingContext2D,
  nodeRadius: number,
  delayDuration: number,
  updateDijkstraNodeCosts: (
    nodeID: number,
    oldNodeCost: number,
    newNodeCost: number
  ) => void
) => {
  let currNode: GNode = {} as GNode;
  let nextNode: GNode = {} as GNode;
  let firstNode;
  updateDijkstraNodeCosts(trace[0][1], 0, 0);
  for (let i = 0; i < trace.length; ++i) {
    let [source, destination, newDistances] = trace[i];
    for (const node of nodes) {
      if (node.id === source) {
        currNode = node;
        if (!firstNode) firstNode = node;
      }
      if (node.id === destination) nextNode = node;
    }
    if (trace.length === 1) {
      firstNode = nextNode;
      nextNode.status = "exploring";
    }
    currNode.status = "exploring";
    drawEdges(ctx, nodes, edges);
    drawNodes(nodes, {
      nodeRadius,
      ctx,
    });
    await visualizationDelay(delayDuration * 1000);

    nextNode.status = "exploring";
    drawEdges(ctx, nodes, edges);
    drawNodes(nodes, {
      nodeRadius,
      ctx,
    });
    updateDijkstraNodeCosts(destination, trace[i][2], trace[i][3]);
    await visualizationDelay(delayDuration * 1000);

    currNode.status = "explored";
    nextNode.status = "explored";
  }

  edges.forEach((edge) => (edge.status = "default"));
  nodes.forEach((node) => (node.status = "default"));

  if (!firstNode) throw "first node must be defined in animateGraph";
  firstNode.status = "selected";

  drawEdges(ctx, nodes, edges);
  drawNodes(nodes, {
    nodeRadius,
    ctx,
  });
};
